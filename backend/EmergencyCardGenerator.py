from flask import Flask, Blueprint, request, jsonify
from db import get_db_connection
import traceback
from flask_cors import CORS
import uuid

# ---------------- APP & BLUEPRINT ---------------- #
app = Flask(__name__)
CORS(app)
emergency_bp = Blueprint("emergency_bp", __name__)

# ---------------- HELPER ---------------- #
def get_member_by_uuid(member_uuid: str):
    """Fetch a family member by their UUID"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM family_members WHERE uuid=%s", (member_uuid,))
    member = cursor.fetchone()
    cursor.close()
    conn.close()
    return member

# ---------------- CREATE/UPDATE UUID ---------------- #
@emergency_bp.route("/generate-uuid/<int:member_id>", methods=["POST"])
def generate_uuid(member_id: int):
    """Assign a new UUID to a member"""
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

# ---------------- SAVE OR UPDATE EMERGENCY CARD ---------------- #
@emergency_bp.route("/emergency/save/<int:member_id>", methods=["POST"])
def save_emergency_card(member_id: int):
    """Save or update emergency health card for a member"""
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()

        # check if card already exists
        cursor.execute("SELECT id FROM emergency_health_cards WHERE member_id=%s", (member_id,))
        existing = cursor.fetchone()

        if existing:
            # Update
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
            # Insert
            cursor.execute("""
                INSERT INTO emergency_health_cards
                (member_id, blood_group, allergies, ongoing_medicines,
                 medical_conditions, emergency_contact_name, emergency_contact_phone,
                 doctor_name, doctor_phone)
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

# ---------------- GET: Public Emergency Card ---------------- #
@emergency_bp.route("/emergency/public/<int:member_id>", methods=["GET"])
def get_public_emergency_card(member_id: int):
    """Return emergency card data for public view (doctor-facing)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT fm.id, fm.name, fm.age, fm.gender, fm.phone,
                   ehc.blood_group, ehc.allergies, ehc.ongoing_medicines,
                   ehc.medical_conditions, ehc.emergency_contact_name,
                   ehc.emergency_contact_phone, ehc.doctor_name, ehc.doctor_phone
            FROM family_members fm
            LEFT JOIN emergency_health_cards ehc ON fm.id = ehc.member_id
            WHERE fm.id = %s
        """, (member_id,))
        member = cursor.fetchone()
        cursor.close()
        conn.close()

        if not member:
            return jsonify({"error": "Member not found"}), 404

        return jsonify(member), 200
    except Exception as e:
        print("❌ Error fetching public emergency card:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ---------------- GET: Doctor View by UUID ---------------- #
@emergency_bp.route("/doctor-view/<string:member_uuid>", methods=["GET"])
def doctor_view(member_uuid: str):
    """Return the emergency health card using the member's UUID"""
    try:
        member = get_member_by_uuid(member_uuid)
        if not member:
            return jsonify({"error": "Member not found"}), 404

        member_id = member["id"]

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM emergency_health_cards WHERE member_id=%s", (member_id,))
        card = cursor.fetchone()
        cursor.close()
        conn.close()

        return jsonify({"member": member, "emergency_card": card}), 200
    except Exception as e:
        print("❌ Error in doctor view:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ---------------- REGISTER BLUEPRINT ---------------- #
app.register_blueprint(emergency_bp)

# ---------------- RUN ---------------- #
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
