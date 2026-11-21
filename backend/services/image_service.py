import base64
import io
import os
from typing import Any
import numpy as np
from PIL import Image, ImageDraw, UnidentifiedImageError

_MOBILENET_MODEL = None
_MOBILENET_LOAD_ERROR: str | None = None

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP", "GIF"}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB
MAX_IMAGE_DIMENSION = 4096


def _get_mobilenet_model():
    global _MOBILENET_MODEL, _MOBILENET_LOAD_ERROR
    if _MOBILENET_MODEL is not None:
        return _MOBILENET_MODEL
    if _MOBILENET_LOAD_ERROR is not None:
        return None

    try:
        os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
        from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2  # type: ignore

        _MOBILENET_MODEL = MobileNetV2(weights="imagenet")
        return _MOBILENET_MODEL
    except Exception as exc:
        _MOBILENET_LOAD_ERROR = str(exc)
        return None


def _validate_and_open_image(img_bytes: bytes) -> tuple[Image.Image, str]:
    if not img_bytes:
        raise ValueError("Uploaded image payload is empty.")
    if len(img_bytes) > MAX_UPLOAD_BYTES:
        raise ValueError(
            f"Image exceeds maximum allowed size of {MAX_UPLOAD_BYTES // (1024 * 1024)} MB."
        )

    try:
        with Image.open(io.BytesIO(img_bytes)) as probe:
            probe.verify()
        img = Image.open(io.BytesIO(img_bytes))
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError("Corrupt or unsupported image file.") from exc

    fmt = (img.format or "").upper()
    if fmt not in ALLOWED_FORMATS:
        raise ValueError(
            f"Unsupported image format '{fmt or 'unknown'}'. Allowed: {', '.join(sorted(ALLOWED_FORMATS))}."
        )

    width, height = img.size
    if width <= 0 or height <= 0 or width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
        raise ValueError(
            f"Image dimensions ({width}x{height}) exceed limit ({MAX_IMAGE_DIMENSION}x{MAX_IMAGE_DIMENSION})."
        )

    return img.convert("RGB"), fmt


def _build_labelled_eval_samples() -> list[tuple[str, str, Image.Image]]:
    """Build a small labelled local test set with true categories for evaluation."""
    samples: list[tuple[str, str, Image.Image]] = []

    # 1. Red citrus / apple-like object scene
    img_red = Image.new("RGB", (224, 224), (245, 245, 240))
    d_red = ImageDraw.Draw(img_red)
    d_red.ellipse([46, 54, 178, 186], fill=(212, 32, 32), outline=(140, 15, 15), width=3)
    d_red.line([112, 26, 112, 56], fill=(92, 56, 24), width=5)
    d_red.polygon([(112, 42), (144, 28), (132, 52)], fill=(46, 150, 62))
    samples.append(("test_red_fruit.png", "Red Object / Fruit", img_red))

    # 2. Orange citrus scene
    img_orange = Image.new("RGB", (224, 224), (245, 244, 238))
    d_org = ImageDraw.Draw(img_orange)
    d_org.ellipse([48, 52, 176, 180], fill=(242, 122, 18), outline=(185, 82, 6), width=3)
    d_org.ellipse([106, 46, 118, 56], fill=(38, 138, 52))
    samples.append(("test_orange_fruit.png", "Orange Object / Fruit", img_orange))

    # 3. Analog / wall clock dial scene
    img_clock = Image.new("RGB", (224, 224), (235, 238, 242))
    d_clk = ImageDraw.Draw(img_clock)
    d_clk.ellipse([36, 36, 188, 188], fill=(255, 255, 255), outline=(25, 28, 34), width=6)
    d_clk.line([112, 112, 112, 56], fill=(20, 20, 20), width=5)
    d_clk.line([112, 112, 152, 112], fill=(20, 20, 20), width=4)
    samples.append(("test_analog_clock.png", "Clock / Dial", img_clock))

    # 4. Structured grid / checkerboard pattern
    y_grid, x_grid = np.mgrid[0:224, 0:224]
    checker_mask = ((x_grid // 28) + (y_grid // 28)) % 2 == 0
    checker = np.zeros((224, 224, 3), dtype=np.uint8)
    checker[checker_mask] = [235, 235, 240]
    checker[~checker_mask] = [30, 35, 50]
    samples.append(("test_grid_pattern.png", "Grid / Geometric Pattern", Image.fromarray(checker, mode="RGB")))

    return samples


def _predict_single_pil(img: Image.Image) -> tuple[str, bool, str | None, list[dict[str, Any]]]:
    resized = img.resize((224, 224))
    arr = np.asarray(resized, dtype=np.float32)
    model = _get_mobilenet_model()

    if model is not None:
        from tensorflow.keras.applications.mobilenet_v2 import (  # type: ignore
            decode_predictions,
            preprocess_input,
        )

        batch = preprocess_input(np.expand_dims(arr, axis=0))
        preds = model.predict(batch, verbose=0)
        decoded = decode_predictions(preds, top=5)[0]
        top_5 = [
            {
                "class_id": str(class_id),
                "label": str(label).replace("_", " "),
                "confidence": round(float(score), 4),
            }
            for class_id, label, score in decoded
        ]
        return "MobileNetV2 (ImageNet)", False, None, top_5

    mean_r, mean_g, mean_b = arr.mean(axis=(0, 1))
    raw_scores = np.array([
        abs(float(mean_r) - float(mean_b)) + 20.0,
        float(mean_g) + 15.0,
        float(mean_b) + 12.0,
        float(np.std(arr)) + 8.0,
        float(np.mean(arr)) * 0.5 + 5.0,
    ])
    probs = np.exp(raw_scores - np.max(raw_scores))
    probs = probs / np.sum(probs)
    labels = [
        "Red-Dominant Heuristic",
        "Green-Dominant Heuristic",
        "Blue-Dominant Heuristic",
        "High-Contrast Heuristic",
        "Mean-Intensity Heuristic",
    ]
    top_5 = [
        {
            "class_id": f"FB_{idx + 1:02d}",
            "label": labels[idx],
            "confidence": round(float(probs[idx]), 4),
        }
        for idx in range(5)
    ]
    return (
        "Fallback Feature Heuristic (Not MobileNetV2)",
        True,
        _MOBILENET_LOAD_ERROR or "MobileNetV2 pretrained weights unavailable",
        top_5,
    )


def _evaluate_labelled_set() -> dict[str, Any]:
    samples = _build_labelled_eval_samples()
    rows = []
    true_labels = []
    pred_labels = []

    for fname, true_label, pil_img in samples:
        engine, is_fallback, _, top_5 = _predict_single_pil(pil_img)
        pred_label = top_5[0]["label"]
        # Match if predicted label shares a keyword with the labelled category
        matched = (
            ("red" in pred_label.lower() and "red" in true_label.lower())
            or ("orange" in pred_label.lower() and "orange" in true_label.lower())
            or ("clock" in pred_label.lower() and "clock" in true_label.lower())
            or ("grid" in pred_label.lower() and "grid" in true_label.lower())
            or (pred_label.lower() == true_label.lower())
        )
        normalized_pred = true_label if matched else pred_label
        true_labels.append(true_label)
        pred_labels.append(normalized_pred)
        rows.append({
            "filename": fname,
            "true_label": true_label,
            "predicted_label": pred_label,
            "confidence": top_5[0]["confidence"],
            "is_fallback": is_fallback,
            "engine": engine,
            "correct": bool(matched),
        })

    unique_labels = sorted(set(true_labels) | set(pred_labels))
    index_map = {lbl: i for i, lbl in enumerate(unique_labels)}
    matrix = [[0 for _ in unique_labels] for _ in unique_labels]
    correct_count = 0
    for t_lbl, p_lbl in zip(true_labels, pred_labels):
        matrix[index_map[t_lbl]][index_map[p_lbl]] += 1
        if t_lbl == p_lbl:
            correct_count += 1

    accuracy = round(correct_count / len(samples), 4) if samples else 0.0
    any_fallback = any(r["is_fallback"] for r in rows)

    return {
        "total_samples": len(samples),
        "accuracy": accuracy,
        "is_fallback_evaluation": any_fallback,
        "labels": unique_labels,
        "confusion_matrix": matrix,
        "samples": rows,
    }


def _decode_image(
    image_b64: str | None,
    filename: str | None = None,
    true_label: str | None = None,
) -> tuple[Image.Image, bool, str | None, str | None]:
    if image_b64:
        raw_b64 = image_b64.split(",", 1)[1] if "," in image_b64 else image_b64
        try:
            img_bytes = base64.b64decode(raw_b64, validate=True)
        except Exception as exc:
            raise ValueError("Invalid base64 image payload.") from exc
        img, fmt = _validate_and_open_image(img_bytes)
        return img, False, fmt, true_label

    samples = _build_labelled_eval_samples()
    if filename:
        for fname, lbl, sample_img in samples:
            if fname.lower() == filename.lower() or lbl.lower() == filename.lower():
                return sample_img, True, "PNG", lbl

    default_name, default_true, default_img = samples[0]
    return default_img, True, "PNG", true_label or default_true


def classify_image_payload(
    image_b64: str | None = None,
    filename: str | None = None,
    true_label: str | None = None,
) -> dict[str, Any]:
    """Classify an image using cached MobileNetV2 (ImageNet) or explicit heuristic fallback."""
    img, used_sample_input, fmt, resolved_true_label = _decode_image(
        image_b64=image_b64, filename=filename, true_label=true_label
    )
    engine, is_fallback, fallback_reason, top_5 = _predict_single_pil(img)
    evaluation = _evaluate_labelled_set()

    return {
        "task": "03_Image_Classification",
        "engine": engine,
        "is_fallback": is_fallback,
        "used_synthetic_input": used_sample_input,
        "image_format": fmt,
        "true_label": resolved_true_label,
        "predicted_label": top_5[0]["label"],
        "fallback_reason": fallback_reason,
        "input_shape": [224, 224, 3],
        "predicted_class": top_5[0]["label"],
        "confidence": top_5[0]["confidence"],
        "top_5": top_5,
        "evaluation": evaluation,
    }