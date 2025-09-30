from flask import Blueprint, jsonify
from db import get_db_connection
import traceback

doctor_view_bp = Blueprint("doctor_view_bp", __name__)

@doctor_view_bp.route("/doctor-view/<string:member_uuid>", methods=["GET"])
def doctor_view(member_uuid):
    """
    Returns member info, emergency health card, timelines, and documents using UUID.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch member info
        cursor.execute("""
            SELECT id, name, age, gender, phone
            FROM family_members
            WHERE uuid = %s
        """, (member_uuid,))
        member = cursor.fetchone()
        if not member:
            return jsonify({"error": "Member not found"}), 404

        member_id = member["id"]

        # Fetch emergency health card
        cursor.execute("""
            SELECT blood_group, allergies, ongoing_medicines, medical_conditions,
                   emergency_contact_name, emergency_contact_phone, doctor_name, doctor_phone,
                   created_at, updated_at
            FROM emergency_health_cards
            WHERE member_id = %s
        """, (member_id,))
        emergency_card = cursor.fetchone() or {}

        # Fetch timelines
        cursor.execute("""
            SELECT id, title, notes, event_type, severity, event_date AS date
            FROM medical_timeline
            WHERE family_member_id = %s
            ORDER BY event_date DESC
        """, (member_id,))
        timelines = cursor.fetchall()

        # Fetch medical documents
        cursor.execute("""
            SELECT id, title, document_type, document_date AS date, notes
            FROM medical_documents
            WHERE family_member_id = %s
            ORDER BY created_at DESC
        """, (member_id,))
        documents = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "member": member,
            "emergency_card": emergency_card,
            "timeline": timelines,
            "documents": documents
        })

    except Exception as e:
        print("❌ Error in doctor view:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
