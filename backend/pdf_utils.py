import fitz  # PyMuPDF
import re

def extract_text_from_pdf(file):
    """
    Extracts text from a PDF file (werkzeug FileStorage object).
    Cleans up CID artifacts, control characters, and normalizes whitespace.
    """
    try:
        # Ensure we're reading from the start
        file.seek(0)
        pdf_bytes = file.read()
        
        # Open PDF from bytes
        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            text = ""
            for page in doc:
                text += page.get_text()
        
        # Remove cid artifacts like (cid:2)
        text = re.sub(r'\(cid:\d+\)', '', text)

        # Replace control characters with spaces
        text = re.sub(r'[\x00-\x1F\x7F-\x9F]', ' ', text)

        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)

        if not text.strip():
            raise ValueError("No extractable text found in PDF.")

        return text.strip()
    except Exception as e:
        print("❌ PDF extraction error:", e)
        raise
