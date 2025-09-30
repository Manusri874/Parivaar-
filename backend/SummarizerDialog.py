from flask import Blueprint, request, jsonify
from pdf_utils import extract_text_from_pdf  # function to extract PDF text
from summarizer import summarize_text, simplify_summary  # T5 summarizer
import traceback

# Blueprint for Medical Summarizer
summarizer_bp = Blueprint("summarizer_bp", __name__)

@summarizer_bp.route("/", methods=["POST"])
def summarize_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file uploaded"}), 400

    try:
        # Extract text from PDF
        text = extract_text_from_pdf(file)
        if not text.strip():
            return jsonify({"error": "PDF contains no extractable text"}), 400

        # Generate summary
        summary = summarize_text(text)
        simplified = simplify_summary(summary)

        return jsonify({
            "original_text": text,
            "summary": summary,
            "simplified": simplified
        })

    except Exception as e:
        print("❌ Error in summarizer:", e)
        traceback.print_exc()
        return jsonify({"error": "Failed to summarize PDF. " + str(e)}), 500
