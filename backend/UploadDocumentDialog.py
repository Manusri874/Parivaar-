from flask import Blueprint, request, jsonify, send_file
from db import get_db_connection
from datetime import datetime
import io
import traceback

documents_bp = Blueprint('documents_bp', __name__)

ALLOWED_EXTENSION = 'pdf'  # Only PDF allowed

# ---------------- Helper ---------------- #
def allowed_file(filename):
    return filename.lower().endswith(ALLOWED_EXTENSION)

# ---------------- POST: Upload Document ---------------- #
@documents_bp.route('/documents/upload', methods=['POST'])
def upload_document():
    try:
        # 1️⃣ Check file presence
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        # 2️⃣ Read form fields
        member_id_str = request.form.get('memberId')
        try:
            member_id = int(member_id_str)
        except:
            return jsonify({'error': 'Invalid memberId'}), 400

        title = request.form.get('title')
        document_type = request.form.get('document_type')
        document_date = request.form.get('document_date')
        notes = request.form.get('notes', '')

        if not title or not document_type or not document_date:
            return jsonify({'error': 'Missing required fields'}), 400

        file_data = file.read()  # Read PDF bytes

        # Debug info
        print(f"📂 Uploading PDF: member_id={member_id}, title={title}, "
              f"file_name={file.filename}, size={len(file_data)} bytes")

        # 3️⃣ Save record to DB
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO medical_documents
            (family_member_id, title, document_type, document_date, notes, file_name, file_data, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
        """, (member_id, title, document_type, document_date, notes, file.filename, file_data))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Document uploaded successfully',
            'file_name': file.filename
        }), 201

    except Exception as e:
        print("❌ Upload error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ---------------- GET: List Documents for Member ---------------- #
@documents_bp.route('/family-members/<int:member_id>/documents', methods=['GET'])
def list_documents(member_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, document_type, document_date, notes, file_name
            FROM medical_documents
            WHERE family_member_id = %s
            ORDER BY created_at DESC
        """, (member_id,))
        documents = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(documents)
    except Exception as e:
        print("❌ List documents error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ---------------- GET: Serve Document File ---------------- #
@documents_bp.route('/documents/<int:doc_id>', methods=['GET'])
def serve_document(doc_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT file_name, file_data FROM medical_documents WHERE id=%s", (doc_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            return jsonify({'error': 'Document not found'}), 404

        file_name, file_data = row

        # Debug info
        print(f"📤 Serving PDF: {file_name}, size={len(file_data)} bytes")

        response = send_file(
            io.BytesIO(file_data),
            mimetype="application/pdf",
            as_attachment=False,
            download_name=file_name
        )

        # Force inline viewing
        response.headers['Content-Disposition'] = f'inline; filename="{file_name}"'
        response.headers['Content-Type'] = 'application/pdf'
        return response

    except Exception as e:
        print("❌ Serve document error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
