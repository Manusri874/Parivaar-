from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import get_db_connection

# Define a blueprint for family member routes
member_bp = Blueprint("member_bp", __name__, url_prefix="/api")

@member_bp.route('/family-members', methods=['POST', 'OPTIONS'])
@cross_origin()  # Allow CORS for this route
def add_family_member():
    # Handle CORS preflight (OPTIONS request)
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request body"}), 400

        user_id = data.get("user_id")
        name = data.get("name")
        phone = data.get("phone")
        email = data.get("email")
        age = data.get("age")
        gender = data.get("gender")
        relation = data.get("relation")

        # Validate required fields
        if not user_id or not name or not relation:
            return jsonify({"error": "User ID, name, and relation are required"}), 400

        # Insert into DB
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO family_members (user_id, name, phone, email, age, gender, relation)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, name, phone, email, age, gender, relation)
        )
        conn.commit()

        return jsonify({"message": "Family member added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass
