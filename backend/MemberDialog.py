from flask import Blueprint, request, jsonify
from db import get_db_connection

primary_member_bp = Blueprint("primary_member_bp", __name__)

# ---------------- GET PRIMARY MEMBER ---------------- #
@primary_member_bp.route("/api/get_primary_member", methods=["GET"])
def get_primary_member():
    """
    Returns the primary family member for the logged-in user.
    For now, we assume user_id is sent as query parameter or in session (adjust as needed).
    """
    # For demo, fetch user_id from query parameter
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id not provided"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch the primary member (relation='Self') for this user
        cursor.execute("""
            SELECT id, name, email, age, gender
            FROM family_members
            WHERE user_id=%s AND relation='Self'
            LIMIT 1
        """, (user_id,))
        member = cursor.fetchone()
        cursor.close()
        conn.close()

        if not member:
            return jsonify({"error": "Primary member not found"}), 404

        return jsonify({"member_id": member["id"], "name": member["name"], "email": member["email"]})
    except Exception as e:
        print("❌ Error fetching primary member:", e)
        return jsonify({"error": str(e)}), 500
