from flask import Blueprint, request, jsonify
from db import get_db_connection
import datetime

timeline_bp = Blueprint("timeline_bp", __name__)

# ---------------- GET TIMELINE FOR A MEMBER ---------------- #
@timeline_bp.route("/family-members/<int:member_id>/timeline", methods=["GET"])
def get_timeline(member_id):
    limit = request.args.get("limit", type=int)  # optional limit parameter
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM medical_timeline WHERE family_member_id=%s ORDER BY event_date DESC"
        params = [member_id]
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ---------------- DELETE TIMELINE ENTRY ---------------- #
@timeline_bp.route("/timeline/<int:entry_id>", methods=["DELETE"])
def delete_timeline_entry(entry_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM medical_timeline WHERE id=%s", (entry_id,))
        conn.commit()
        return jsonify({"message": "Timeline entry deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
