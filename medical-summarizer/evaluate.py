# evaluate.py (batch mode)
import os
import textstat
import matplotlib.pyplot as plt
from app.pdf_utils import extract_text_from_pdf
from app.summarizer import summarize_text, simplify_summary

REPORTS_DIR = "reports"

def evaluate_texts(original, summary, simplified):
    return {
        "original_len": len(original.split()),
        "summary_len": len(summary.split()),
        "simplified_len": len(simplified.split()),
        "compression_ratio": 0 if len(original.split()) == 0 else round(len(summary.split())/len(original.split()), 3),
        "original_readability": textstat.flesch_reading_ease(original),
        "summary_readability": textstat.flesch_reading_ease(summary),
        "simplified_readability": textstat.flesch_reading_ease(simplified),
    }

def gather_metrics():
    metrics = []
    files = [f for f in os.listdir(REPORTS_DIR) if f.lower().endswith(".pdf")]
    for i, fname in enumerate(sorted(files)):
        with open(os.path.join(REPORTS_DIR, fname), "rb") as f:
            original = extract_text_from_pdf(f)
        summary = summarize_text(original)
        simplified = simplify_summary(summary)
        m = evaluate_texts(original, summary, simplified)
        m["doc"] = fname
        metrics.append(m)
        print(f"[{i+1}/{len(files)}] {fname}: ratio={m['compression_ratio']}, "
              f"FRE summary={m['summary_readability']:.1f}")
    return metrics

def plot_all(metrics):
    # lengths
    originals = [m["original_len"] for m in metrics]
    summaries = [m["summary_len"] for m in metrics]
    simplifieds = [m["simplified_len"] for m in metrics]

    # 1) Scatter: Original vs Summary/Simplified length
    plt.figure(figsize=(7,5))
    plt.scatter(originals, summaries, label="Summary")
    plt.scatter(originals, simplifieds, label="Simplified", marker="x")
    plt.xlabel("Original Length (words)"); plt.ylabel("Output Length (words)")
    plt.title("Original vs Output Lengths (All PDFs)"); plt.legend()
    plt.savefig("scatter_lengths.png"); plt.close()

    # 2) Histogram: Compression ratio distribution
    ratios = [m["compression_ratio"] for m in metrics if m["compression_ratio"] > 0]
    plt.figure(figsize=(7,5))
    plt.hist(ratios, bins=10)
    plt.xlabel("Compression Ratio (summary_len / original_len)")
    plt.ylabel("Count")
    plt.title("Compression Ratio Distribution")
    plt.savefig("hist_compression.png"); plt.close()

    # 3) Boxplot: Readability (FRE) across docs
    import numpy as np
    fre_o = [m["original_readability"] for m in metrics]
    fre_s = [m["summary_readability"] for m in metrics]
    fre_p = [m["simplified_readability"] for m in metrics]
    plt.figure(figsize=(7,5))
    plt.boxplot([fre_o, fre_s, fre_p], labels=["Original", "Summary", "Simplified"])
    plt.ylabel("Flesch Reading Ease"); plt.title("Readability Across Documents")
    plt.savefig("boxplot_readability_all.png"); plt.close()

    # 4) Stacked bars: Kept vs Removed words (top 10 docs to keep it readable)
    kept = summaries[:10]
    removed = [(o - s) for o, s in zip(originals[:10], summaries[:10])]
    plt.figure(figsize=(10,5))
    x = range(len(kept))
    plt.bar(x, kept, label="Kept (Summary)")
    plt.bar(x, removed, bottom=kept, label="Removed")
    plt.xticks(x, [f"Doc{i+1}" for i in x])
    plt.ylabel("Word Count"); plt.title("Word Count Breakdown (Top 10)")
    plt.legend(); plt.savefig("stacked_bar_wordcount_top10.png"); plt.close()

if __name__ == "__main__":
    mets = gather_metrics()
    plot_all(mets)
    print("✅ Saved: scatter_lengths.png, hist_compression.png, boxplot_readability_all.png, stacked_bar_wordcount_top10.png")
