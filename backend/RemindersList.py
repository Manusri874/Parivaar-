from flask import Blueprint, request, jsonify
from db import get_db_connection

reminders_bp = Blueprint("reminders_bp", __name__)

# -------------------- GET reminders for a family member --------------------
@reminders_bp.route("/family-members/<int:member_id>/reminders", methods=["GET"])
def get_reminders(member_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """SELECT id, family_member_id, title, reminder_type, start_date, end_date,
                      reminder_time, frequency, day_of_week, day_of_month, dosage, notes,
                      is_active, created_at
               FROM reminders
               WHERE family_member_id=%s
               ORDER BY start_date DESC""",
            (member_id,),
        )
        reminders = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(reminders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- DELETE reminder --------------------
@reminders_bp.route("/reminders/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM reminders WHERE id=%s", (reminder_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Reminder deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- TOGGLE active status --------------------
@reminders_bp.route("/reminders/<int:reminder_id>/toggle-active", methods=["PUT"])
def toggle_reminder(reminder_id):
    try:
        data = request.json
        is_active = data.get("is_active", True)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE reminders SET is_active=%s WHERE id=%s", (is_active, reminder_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Reminder updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- MARK reminder as taken (safe) --------------------
@reminders_bp.route("/reminders/<int:reminder_id>/mark-taken", methods=["POST"])
def mark_taken(reminder_id):
    try:
        data = request.json
        family_member_id = data.get("member_id")

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if reminder_logs table exists
        cursor.execute("SHOW TABLES LIKE 'reminder_logs'")
        table_exists = cursor.fetchone()

        if not table_exists:
            # Return safe response if table missing
            cursor.close()
            conn.close()
            return jsonify({"message": "Reminder marked as taken (table 'reminder_logs' missing)"}), 200

        # Insert log if table exists
        status = data.get("status", "Taken")
        notes = data.get("notes", "")
        cursor.execute(
            """INSERT INTO reminder_logs (reminder_id, family_member_id, status, notes, created_at)
               VALUES (%s, %s, %s, %s, NOW())""",
            (reminder_id, family_member_id, status, notes),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Reminder marked as taken"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
