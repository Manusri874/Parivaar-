from flask import Blueprint, jsonify
from db import get_db_connection
import os

documents_bp = Blueprint("documents_bp", __name__)

# ---------------- GET DOCUMENTS FOR MEMBER ---------------- #
@documents_bp.route("/family-members/<int:member_id>/documents", methods=["GET"])
def get_member_documents(member_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, document_type, document_date, notes, file_path as file_url, file_name, created_at
            FROM medical_documents
            WHERE family_member_id=%s
            ORDER BY document_date DESC
        """, (member_id,))
        documents = cursor.fetchall()
        cursor.close()
        conn.close()

        # Fix file URLs for frontend
        for doc in documents:
            if doc["file_url"]:
                doc["file_url"] = f"http://127.0.0.1:8000/uploads/documents/{doc['file_url']}"
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- DELETE DOCUMENT ---------------- #
@documents_bp.route("/documents/<int:document_id>", methods=["DELETE"])
def delete_document(document_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT file_path FROM medical_documents WHERE id=%s", (document_id,))
        file_row = cursor.fetchone()
        if file_row and file_row[0]:
            file_path = os.path.join("uploads/documents", file_row[0])
            if os.path.exists(file_path):
                os.remove(file_path)

        cursor.execute("DELETE FROM medical_documents WHERE id=%s", (document_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Document deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
