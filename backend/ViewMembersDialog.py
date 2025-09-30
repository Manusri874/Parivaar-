from flask import Blueprint, request, jsonify
from db import get_db_connection

view_members_bp = Blueprint("view_members_bp", __name__)

# Get all family members for a user
@view_members_bp.route("/api/family-members", methods=["GET"])
def get_family_members():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT id, user_id, name, phone, email, age, gender, relation
            FROM family_members
            WHERE user_id = %s
            ORDER BY id DESC
            """,
            (user_id,)
        )
        members = cursor.fetchall()
        return jsonify(members), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get single member by ID
@view_members_bp.route("/api/family-members/<int:member_id>", methods=["GET"])
def get_family_member(member_id):
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            """
            SELECT id, user_id, name, phone, email, age, gender, relation
            FROM family_members
            WHERE id = %s AND user_id = %s
            """,
            (member_id, user_id)
        )
        member = cursor.fetchone()
        if not member:
            return jsonify({"error": "Member not found"}), 404
        return jsonify(member), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get count of family members for a user
@view_members_bp.route("/api/family-members/count", methods=["GET"])
def get_family_member_count():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT COUNT(*) as count
            FROM family_members
            WHERE user_id = %s
            """,
            (user_id,)
        )
        result = cursor.fetchone()
        return jsonify({"count": result[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
