from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch
from re import sub

# ---------------- MODEL LOADING ---------------- #
tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# ---------------- HELPER ---------------- #
def clean_text(text: str) -> str:
    """Remove excessive whitespace and normalize text."""
    return sub(r'\s+', ' ', text).strip()

def generate_summary(input_text: str, max_input_length=512, max_output_length=150) -> str:
    """Helper to generate text using T5 safely."""
    try:
        inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=max_input_length, truncation=True)
        inputs = inputs.to(device)
        summary_ids = model.generate(
            inputs,
            max_length=max_output_length,
            min_length=40,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )
        return tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    except Exception as e:
        print("❌ Summarization error:", e)
        return "Error generating summary."

# ---------------- SUMMARIZATION ---------------- #
def summarize_text(text: str) -> str:
    text = clean_text(text)
    if not text:
        return "No text to summarize."
    input_text = "summarize: " + text
    return generate_summary(input_text, max_input_length=512, max_output_length=150)

# ---------------- SIMPLIFY SUMMARY ---------------- #
def simplify_summary(summary: str) -> str:
    summary = clean_text(summary)
    if not summary:
        return "No summary to simplify."
    prompt = f"Explain this medical summary to a patient in simple language with no medical knowledge: {summary}"
    return generate_summary(prompt, max_input_length=512, max_output_length=180)
