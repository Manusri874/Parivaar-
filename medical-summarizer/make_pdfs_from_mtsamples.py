# make_pdfs_from_mtsamples.py
import os
import re
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib import enums

# Get base directory (where this script is located)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Correct paths
CSV_PATH = os.path.join(BASE_DIR, "data", "mtsamples.csv")   # CSV inside /data
OUT_DIR = os.path.join(BASE_DIR, "reports")                  # PDFs will be saved here
N_DOCS = 50                                                  # how many PDFs to generate

def slugify(s: str, maxlen=60):
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE).strip().lower()
    s = re.sub(r"[-\s]+", "-", s)
    return s[:maxlen] or "report"

def build_pdf(row, idx):
    title = str(row.get("sample_name") or row.get("Sample Name") or f"Medical Report #{idx}")
    specialty = str(row.get("medical_specialty") or row.get("Medical Specialty") or "General")
    description = str(row.get("description") or row.get("Description") or "").strip()
    body = str(row.get("transcription") or row.get("Transcription") or "").strip()

    # Basic fallback if body is empty
    if not body:
        body = "No transcription text available in this sample."

    filename = f"{idx:03d}_{slugify(title)}.pdf"
    path = os.path.join(OUT_DIR, filename)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        alignment=enums.TA_LEFT,
        spaceAfter=6,
    )
    meta_style = ParagraphStyle(
        "Meta",
        parent=styles["Normal"],
        textColor="#444444",
        leading=14,
        spaceAfter=10,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        leading=14,
        spaceAfter=8,
    )
    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        spaceBefore=6,
        spaceAfter=4,
    )

    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=0.8*inch,
        rightMargin=0.8*inch,
        topMargin=0.8*inch,
        bottomMargin=0.8*inch,
        title=title,
        author="De-identified Sample",
    )

    story = []
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(f"<b>Specialty:</b> {specialty}", meta_style))
    if description:
        story.append(Paragraph(f"<b>Description:</b> {description}", body_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Report", section_style))
    # Replace double newlines with <br/> to keep paragraph breaks
    story.append(Paragraph(body.replace("\n\n", "<br/><br/>").replace("\n", "<br/>"), body_style))

    doc.build(story)
    return path

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    df = pd.read_csv(CSV_PATH)

    # Prefer longer transcripts so PDFs look “proper”, then take first N
    length_col = "transcription" if "transcription" in df.columns else "Transcription"
    df["_len"] = df[length_col].fillna("").astype(str).str.split().str.len()
    df = df.sort_values("_len", ascending=False).head(N_DOCS)

    paths = []
    for i, row in enumerate(df.to_dict("records"), start=1):
        p = build_pdf(row, i)
        paths.append(p)

    print(f"✅ Created {len(paths)} PDFs in '{OUT_DIR}/'")
    for p in paths[:5]:
        print(" -", p)

if __name__ == "__main__":
    main()
