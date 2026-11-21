import os
import json
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")


def create_sample_images() -> list[str]:
    os.makedirs(DATASET_DIR, exist_ok=True)
    y_grid, x_grid = np.mgrid[0:224, 0:224]

    # 1. Checkerboard pattern
    checker_mask = ((x_grid // 28) + (y_grid // 28)) % 2 == 0
    checker = np.zeros((224, 224, 3), dtype=np.uint8)
    checker[checker_mask] = [235, 235, 240]
    checker[~checker_mask] = [30, 35, 50]

    # 2. Radial rings + horizontal gradient
    cx, cy = 112.0, 112.0
    dist = np.sqrt((x_grid - cx) ** 2 + (y_grid - cy) ** 2)
    rings = ((dist // 18).astype(np.uint8) % 2) * 140
    grad_r = np.clip((x_grid / 223.0) * 220 + rings * 0.25, 0, 255).astype(np.uint8)
    grad_g = np.clip((y_grid / 223.0) * 200 + ((dist % 36) / 36.0) * 55, 0, 255).astype(np.uint8)
    grad_b = np.clip(220 - (dist / 160.0) * 180 + rings * 0.2, 0, 255).astype(np.uint8)
    radial = np.stack([grad_r, grad_g, grad_b], axis=-1)

    # 3. Multi-shape geometric scene on textured background
    shapes = np.zeros((224, 224, 3), dtype=np.uint8)
    shapes[:, :] = [24, 28, 38]
    shapes[30:95, 30:110] = [220, 75, 90]
    shapes[115:195, 110:195] = [50, 180, 130]
    circle_mask = (x_grid - 165) ** 2 + (y_grid - 68) ** 2 <= 32 ** 2
    shapes[circle_mask] = [55, 155, 235]

    samples = {
        "sample_checkerboard.png": checker,
        "sample_radial_wave.png": radial,
        "sample_geometric_shapes.png": shapes,
    }
    paths = []
    for name, arr in samples.items():
        p = os.path.join(DATASET_DIR, name)
        Image.fromarray(arr, mode="RGB").save(p)
        paths.append(p)
    return paths


def classify_image_file(image_path: str) -> dict:
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
        labels = ["Crimson Specimen", "Foliage Green", "Azure Field", "Texture Pattern", "General Object"]
        ranked_indices = np.argsort(probs)[::-1]
        top_5 = [
            {
                "class_id": f"IMG_{rank + 1:02d}",
                "label": labels[idx],
                "confidence": round(float(probs[idx]), 4),
            }
            for rank, idx in enumerate(ranked_indices)
        ]
        engine = "Deterministic RGB/Feature Fallback"
        is_fallback = True

    return {
        "file": os.path.basename(image_path),
        "engine": engine,
        "is_fallback": is_fallback,
        "top_1": top_5[0]["label"],
        "confidence": top_5[0]["confidence"],
        "top_5": top_5,
    }


def run_image_classification() -> list[dict]:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)

    sample_paths = create_sample_images()
    results = [classify_image_file(p) for p in sample_paths]

    plt.figure(figsize=(7, 4))
    plt.bar([r["file"] for r in results], [r["confidence"] for r in results], color="#A855F7")
    plt.ylim(0, 1.05)
    plt.title("Top-1 Confidence Across Sample Test Images")
    plt.ylabel("Confidence")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "sample_confidences.png"), dpi=150)
    plt.close()

    with open(os.path.join(STATS_DIR, "predictions.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    return results


if __name__ == "__main__":
    print("Task 03 Image Classification:", run_image_classification())