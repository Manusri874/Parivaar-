from flask import Flask, request, jsonify, Blueprint, redirect
from flask_cors import CORS
import bcrypt
import jwt
import datetime
import os
import traceback
import uuid
from db import get_db_connection

# ---------------- BLUEPRINT IMPORTS ---------------- #
from AddMemberDialog import member_bp
from ViewMembersDialog import view_members_bp
from UploadDocumentDialog import documents_bp
from AddReminderDialog import reminders_bp
from AddTimelineDialog import timeline_bp
from SummarizerDialog import summarizer_bp  # ✅ Medical Summarizer

# ---------------- APP CONFIG ---------------- #
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080"]}}, supports_credentials=True)

SECRET_KEY = "your-secret-key"

UPLOAD_FOLDER = "uploads/documents"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- ROOT ---------------- #
@app.route("/")
def index():
    return "Flask server is running!"

# ---------------- AUTH: SIGNUP ---------------- #
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (email, hashed_pw)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return jsonify({"message": "User created successfully!", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# ---------------- AUTH: LOGIN ---------------- #
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        payload = {
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return jsonify({"message": "Login successful!", "token": token, "user_id": user["id"]}), 200

    return jsonify({"error": "Invalid credentials"}), 401

# ---------------- FAMILY MEMBER COUNT ---------------- #
@app.route("/api/family_members/count", methods=["GET"])
def get_family_member_count():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM family_members")
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return jsonify({"count": count})

# ---------------- EMERGENCY BLUEPRINT ---------------- #
emergency_bp = Blueprint("emergency_bp", __name__)

def get_member_by_uuid(member_uuid: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM family_members WHERE uuid=%s", (member_uuid,))
    member = cursor.fetchone()
    cursor.close()
    conn.close()
    return member

@emergency_bp.route("/generate-uuid/<int:member_id>", methods=["POST"])
def generate_uuid(member_id: int):
    try:
        member_uuid = str(uuid.uuid4())
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE family_members SET uuid=%s WHERE id=%s", (member_uuid, member_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"uuid": member_uuid}), 200
    except Exception as e:
        print("❌ Error generating UUID:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@emergency_bp.route("/doctor-view/<string:member_uuid>", methods=["GET"])
def doctor_view_redirect(member_uuid: str):
    frontend_url = f"http://localhost:8080/doctor-view/{member_uuid}"
    return redirect(frontend_url)

@emergency_bp.route("/api/doctor-view/<string:member_uuid>", methods=["GET"])
def doctor_view_data(member_uuid: str):
    try:
        member = get_member_by_uuid(member_uuid)
        if not member:
            return jsonify({"error": "Member not found"}), 404

        member_id = member["id"]
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM emergency_health_cards WHERE member_id=%s", (member_id,))
        card = cursor.fetchone()

        cursor.execute("""
            SELECT id, title, event_type, event_date AS date, severity, notes
            FROM medical_timeline
            WHERE family_member_id=%s
            ORDER BY event_date DESC
        """, (member_id,))
        timeline = cursor.fetchall()

        cursor.execute("""
            SELECT id, title, document_type, document_date, notes, file_name
            FROM medical_documents
            WHERE family_member_id=%s
            ORDER BY created_at DESC
        """, (member_id,))
        documents = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "member": member,
            "emergency_card": card,
            "timeline": timeline,
            "documents": documents
        })
    except Exception as e:
        print("❌ Error in doctor view API:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@emergency_bp.route("/emergency/save/<int:member_id>", methods=["POST"])
def save_emergency_card(member_id: int):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM emergency_health_cards WHERE member_id=%s", (member_id,))
        existing = cursor.fetchone()

        if existing:
            cursor.execute("""
                UPDATE emergency_health_cards
                SET blood_group=%s, allergies=%s, ongoing_medicines=%s,
                    medical_conditions=%s, emergency_contact_name=%s,
                    emergency_contact_phone=%s, doctor_name=%s, doctor_phone=%s
                WHERE member_id=%s
            """, (
                data.get("blood_group"), data.get("allergies"), data.get("ongoing_medicines"),
                data.get("medical_conditions"), data.get("emergency_contact_name"),
                data.get("emergency_contact_phone"), data.get("doctor_name"), data.get("doctor_phone"),
                member_id
            ))
        else:
            cursor.execute("""
                INSERT INTO emergency_health_cards
                (member_id, blood_group, allergies, ongoing_medicines, medical_conditions,
                emergency_contact_name, emergency_contact_phone, doctor_name, doctor_phone)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                member_id, data.get("blood_group"), data.get("allergies"), data.get("ongoing_medicines"),
                data.get("medical_conditions"), data.get("emergency_contact_name"),
                data.get("emergency_contact_phone"), data.get("doctor_name"), data.get("doctor_phone")
            ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Emergency health card saved successfully"}), 200
    except Exception as e:
        print("❌ Error saving emergency card:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ---------------- REGISTER BLUEPRINTS ---------------- #
app.register_blueprint(member_bp)
app.register_blueprint(view_members_bp)
app.register_blueprint(documents_bp, url_prefix="/api")
app.register_blueprint(reminders_bp, url_prefix="/api")
app.register_blueprint(timeline_bp, url_prefix="/api")
app.register_blueprint(emergency_bp)
app.register_blueprint(summarizer_bp, url_prefix="/api/summarizer")  # ✅ Medical Summarizer

# ---------------- RUN ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
