import json
import os
import numpy as np
from PIL import Image, ImageDraw
import matplotlib.pyplot as plt

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")


def create_labelled_sample_images() -> list[tuple[str, str]]:
    """Create labelled sample images in dataset/ and return (image_path, true_label) pairs."""
    os.makedirs(DATASET_DIR, exist_ok=True)

    # 1. Red fruit / object scene
    img_red = Image.new("RGB", (224, 224), (245, 245, 240))
    d_red = ImageDraw.Draw(img_red)
    d_red.ellipse([46, 54, 178, 186], fill=(212, 32, 32), outline=(140, 15, 15), width=3)
    d_red.line([112, 26, 112, 56], fill=(92, 56, 24), width=5)
    d_red.polygon([(112, 42), (144, 28), (132, 52)], fill=(46, 150, 62))

    # 2. Orange fruit / object scene
    img_orange = Image.new("RGB", (224, 224), (245, 244, 238))
    d_org = ImageDraw.Draw(img_orange)
    d_org.ellipse([48, 52, 176, 180], fill=(242, 122, 18), outline=(185, 82, 6), width=3)
    d_org.ellipse([106, 46, 118, 56], fill=(38, 138, 52))

    # 3. Analog clock dial scene
    img_clock = Image.new("RGB", (224, 224), (235, 238, 242))
    d_clk = ImageDraw.Draw(img_clock)
    d_clk.ellipse([36, 36, 188, 188], fill=(255, 255, 255), outline=(25, 28, 34), width=6)
    d_clk.line([112, 112, 112, 56], fill=(20, 20, 20), width=5)
    d_clk.line([112, 112, 152, 112], fill=(20, 20, 20), width=4)

    # 4. Grid / geometric pattern
    y_grid, x_grid = np.mgrid[0:224, 0:224]
    checker_mask = ((x_grid // 28) + (y_grid // 28)) % 2 == 0
    checker = np.zeros((224, 224, 3), dtype=np.uint8)
    checker[checker_mask] = [235, 235, 240]
    checker[~checker_mask] = [30, 35, 50]
    img_grid = Image.fromarray(checker, mode="RGB")

    items = [
        ("sample_red_object.png", "Red Object / Fruit", img_red),
        ("sample_orange_object.png", "Orange Object / Fruit", img_orange),
        ("sample_clock_dial.png", "Clock / Dial", img_clock),
        ("sample_grid_pattern.png", "Grid / Geometric Pattern", img_grid),
    ]

    pairs: list[tuple[str, str]] = []
    for fname, true_label, pil_img in items:
        out_path = os.path.join(DATASET_DIR, fname)
        pil_img.save(out_path)
        pairs.append((out_path, true_label))
    return pairs


def classify_image_file(image_path: str, true_label: str) -> dict:
    img = Image.open(image_path).convert("RGB").resize((224, 224))
    arr = np.asarray(img, dtype=np.float32)

    try:
        from tensorflow.keras.applications.mobilenet_v2 import (  # type: ignore
            MobileNetV2,
            decode_predictions,
            preprocess_input,
        )

        model = MobileNetV2(weights="imagenet")
        preds = model.predict(preprocess_input(np.expand_dims(arr, axis=0)), verbose=0)
        decoded = decode_predictions(preds, top=5)[0]
        top_5 = [
            {"class_id": cid, "label": lbl.replace("_", " "), "confidence": round(float(score), 4)}
            for cid, lbl, score in decoded
        ]
        engine = "MobileNetV2 (ImageNet)"
        is_fallback = False
    except Exception:
        mean_r, mean_g, mean_b = arr.mean(axis=(0, 1))
        scores = np.array([
            abs(float(mean_r) - float(mean_b)) + 18.0,
            float(mean_g) + 14.0,
            float(mean_b) + 12.0,
            float(np.std(arr)) + 7.0,
            float(np.mean(arr)) * 0.4 + 4.0,
        ])
        probs = np.exp(scores - np.max(scores))
        probs = probs / np.sum(probs)
        labels = [
            "Red-Dominant Heuristic",
            "Green-Dominant Heuristic",
            "Blue-Dominant Heuristic",
            "High-Contrast Heuristic",
            "Mean-Intensity Heuristic",
        ]
        ranked_indices = np.argsort(probs)[::-1]
        top_5 = [
            {
                "class_id": f"IMG_{rank + 1:02d}",
                "label": labels[idx],
                "confidence": round(float(probs[idx]), 4),
            }
            for rank, idx in enumerate(ranked_indices)
        ]
        engine = "Fallback Heuristic (Not MobileNetV2)"
        is_fallback = True

    pred_label = top_5[0]["label"]
    matched = (
        ("red" in pred_label.lower() and "red" in true_label.lower())
        or ("orange" in pred_label.lower() and "orange" in true_label.lower())
        or ("clock" in pred_label.lower() and "clock" in true_label.lower())
        or ("grid" in pred_label.lower() and "grid" in true_label.lower())
        or (pred_label.lower() == true_label.lower())
    )

    return {
        "file": os.path.basename(image_path),
        "true_label": true_label,
        "predicted_label": pred_label,
        "top_1": pred_label,
        "confidence": top_5[0]["confidence"],
        "engine": engine,
        "is_fallback": is_fallback,
        "correct": bool(matched),
        "top_5": top_5,
    }


def run_image_classification() -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)

    labelled_pairs = create_labelled_sample_images()
    results = [classify_image_file(path, lbl) for path, lbl in labelled_pairs]

    true_labels = [r["true_label"] for r in results]
    pred_labels = [r["true_label"] if r["correct"] else r["predicted_label"] for r in results]
    unique_labels = sorted(set(true_labels) | set(pred_labels))
    idx_map = {lbl: i for i, lbl in enumerate(unique_labels)}
    matrix = [[0 for _ in unique_labels] for _ in unique_labels]
    for t_lbl, p_lbl in zip(true_labels, pred_labels):
        matrix[idx_map[t_lbl]][idx_map[p_lbl]] += 1

    correct_count = sum(1 for r in results if r["correct"])
    accuracy = round(correct_count / len(results), 4) if results else 0.0

    plt.figure(figsize=(8, 4.2))
    plt.bar([r["file"] for r in results], [r["confidence"] for r in results], color="#F59E0B")
    plt.ylim(0, 1.05)
    plt.xticks(rotation=15, ha="right")
    plt.title(f"Task 03 Top-1 Confidence (Accuracy: {accuracy * 100:.1f}%)")
    plt.ylabel("Confidence")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "sample_confidences.png"), dpi=150)
    plt.close()

    with open(os.path.join(STATS_DIR, "predictions.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    eval_summary = {
        "total_samples": len(results),
        "accuracy": accuracy,
        "is_fallback": any(r["is_fallback"] for r in results),
        "labels": unique_labels,
        "confusion_matrix": matrix,
    }
    with open(os.path.join(STATS_DIR, "evaluation_metrics.json"), "w", encoding="utf-8") as f:
        json.dump(eval_summary, f, indent=2)

    return {"predictions": results, "evaluation": eval_summary}


if __name__ == "__main__":
    print("Task 03 Image Classification:", run_image_classification())