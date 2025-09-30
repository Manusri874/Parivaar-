from flask import Blueprint, request, jsonify
from db import get_db_connection
import traceback
from app.pdf_utils import extract_text_from_pdf
from app.summarizer import summarize_text, simplify_summary

summarizer_bp = Blueprint("summarizer_bp", __name__)

# ---------------- POST: Summarize Medical Report ---------------- #
@summarizer_bp.route("/api/summarize", methods=["POST"])
def summarize_report():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # Extract text from PDF
        text = extract_text_from_pdf(file)

        # Generate summary
        summary = summarize_text(text)

        # Generate simplified version
        simplified = simplify_summary(summary)

        return jsonify({
            "original_text": text,
            "summary": summary,
            "simplified": simplified
        }), 200

    except Exception as e:
        print("❌ Error in summarizer API:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
