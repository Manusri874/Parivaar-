from flask import Blueprint, request, jsonify
from db import get_db_connection
import datetime

timeline_bp = Blueprint("timeline_bp", __name__)

# ---------------- POST: Add Timeline Entry ---------------- #
@timeline_bp.route("/timeline", methods=["POST", "OPTIONS"])
def add_timeline_entry():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        member_id = data.get("member_id")
        title = data.get("title")
        event_type = data.get("event_type")
        event_date = data.get("event_date")
        severity = data.get("severity")
        notes = data.get("notes")

        if not member_id or not title or not event_type or not event_date:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO medical_timeline
            (family_member_id, title, event_type, event_date, severity, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (member_id, title, event_type, event_date, severity, notes)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Timeline entry added successfully"}), 201

    except Exception as e:
        print("❌ Add timeline error:", e)
        return jsonify({"error": str(e)}), 500

# ---------------- GET: List Timeline Entries ---------------- #
@timeline_bp.route("/family-members/<int:member_id>/timeline", methods=["GET"])
def list_timeline(member_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, title, event_type, event_date, severity, notes, created_at
            FROM medical_timeline
            WHERE family_member_id = %s
            ORDER BY event_date DESC
            """,
            (member_id,)
        )
        entries = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert datetime to string
        for entry in entries:
            if isinstance(entry.get("event_date"), (datetime.date, datetime.datetime)):
                entry["event_date"] = entry["event_date"].isoformat()
            if isinstance(entry.get("created_at"), (datetime.date, datetime.datetime)):
                entry["created_at"] = entry["created_at"].isoformat()

        return jsonify(entries), 200

    except Exception as e:
        print("❌ List timeline error:", e)
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, request, jsonify
from db import get_db_connection
import datetime

timeline_bp = Blueprint("timeline_bp", __name__)

# ---------------- POST: Add Timeline Entry ---------------- #
@timeline_bp.route("/timeline", methods=["POST", "OPTIONS"])
def add_timeline_entry():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200

    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        member_id = data.get("member_id")
        title = data.get("title")
        event_type = data.get("event_type")
        event_date = data.get("event_date")
        severity = data.get("severity")
        notes = data.get("notes")

        if not member_id or not title or not event_type or not event_date:
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO medical_timeline
            (family_member_id, title, event_type, event_date, severity, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (member_id, title, event_type, event_date, severity, notes)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Timeline entry added successfully"}), 201

    except Exception as e:
        print("❌ Add timeline error:", e)
        return jsonify({"error": str(e)}), 500

# ---------------- GET: List Timeline Entries ---------------- #
@timeline_bp.route("/family-members/<int:member_id>/timeline", methods=["GET"])
def list_timeline(member_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, title, event_type, event_date, severity, notes, created_at
            FROM medical_timeline
            WHERE family_member_id = %s
            ORDER BY event_date DESC
            """,
            (member_id,)
        )
        entries = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert datetime to string
        for entry in entries:
            if isinstance(entry.get("event_date"), (datetime.date, datetime.datetime)):
                entry["event_date"] = entry["event_date"].isoformat()
            if isinstance(entry.get("created_at"), (datetime.date, datetime.datetime)):
                entry["created_at"] = entry["created_at"].isoformat()

        return jsonify(entries), 200

    except Exception as e:
        print("❌ List timeline error:", e)
        return jsonify({"error": str(e)}), 500
