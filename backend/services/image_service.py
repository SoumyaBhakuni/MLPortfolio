import base64
import io
import os
from typing import Any
import numpy as np
from PIL import Image

_MOBILENET_MODEL = None
_MOBILENET_LOAD_ERROR: str | None = None


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


def _decode_image(image_b64: str | None, filename: str | None = None) -> tuple[Image.Image, bool]:
    if image_b64:
        raw_b64 = image_b64.split(",", 1)[1] if "," in image_b64 else image_b64
        try:
            img_bytes = base64.b64decode(raw_b64)
            return Image.open(io.BytesIO(img_bytes)).convert("RGB"), False
        except Exception as exc:
            raise ValueError("Invalid base64 image data.") from exc

    seed = sum(ord(ch) for ch in (filename or "sample_input")) % 255
    y_grid, x_grid = np.mgrid[0:224, 0:224]
    r = ((x_grid + seed) % 256).astype(np.uint8)
    g = ((y_grid + seed * 2) % 256).astype(np.uint8)
    b = (((x_grid + y_grid) // 2 + seed * 3) % 256).astype(np.uint8)
    arr = np.stack([r, g, b], axis=-1)
    return Image.fromarray(arr, mode="RGB"), True


def classify_image_payload(
    image_b64: str | None = None, filename: str | None = None
) -> dict[str, Any]:
    """Classify an image using cached MobileNetV2 (ImageNet) or explicit heuristic fallback."""
    img, used_synthetic_input = _decode_image(image_b64=image_b64, filename=filename)
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
        return {
            "task": "03_Image_Classification",
            "engine": "MobileNetV2 (ImageNet)",
            "is_fallback": False,
            "used_synthetic_input": used_synthetic_input,
            "fallback_reason": None,
            "input_shape": [224, 224, 3],
            "predicted_class": top_5[0]["label"],
            "confidence": top_5[0]["confidence"],
            "top_5": top_5,
        }

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

    return {
        "task": "03_Image_Classification",
        "engine": "Fallback Feature Heuristic (Not MobileNetV2)",
        "is_fallback": True,
        "used_synthetic_input": used_synthetic_input,
        "fallback_reason": _MOBILENET_LOAD_ERROR or "MobileNetV2 model unavailable",
        "input_shape": [224, 224, 3],
        "predicted_class": top_5[0]["label"],
        "confidence": top_5[0]["confidence"],
        "top_5": top_5,
    }