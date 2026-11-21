import os
import threading
from typing import Any
import joblib
import numpy as np
from sklearn.datasets import load_digits
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from utils.metrics import classification_metrics_dict

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_DIR, ".."))
MODEL_PATH = os.path.join(
    PROJECT_ROOT, "models", "neural_network", "digits_mlp.joblib"
)

_CACHE_LOCK = threading.Lock()
_CACHED_BUNDLE: dict[str, Any] | None = None


def _evaluate_on_split(model: MLPClassifier, digits: Any) -> tuple[dict[str, Any], dict[str, Any]]:
    X = digits.data / 16.0
    y = digits.target
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    preds = model.predict(X_test)
    metrics = classification_metrics_dict(
        y_test, preds, labels=list(range(10)), average="weighted"
    )
    report = classification_report(y_test, preds, output_dict=True, zero_division=0)
    return metrics, report


def _train_and_save_model(digits: Any) -> tuple[MLPClassifier, str]:
    X = digits.data / 16.0
    y = digits.target
    X_train, _, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    mlp = MLPClassifier(
        hidden_layer_sizes=(64, 32),
        activation="relu",
        max_iter=300,
        random_state=42,
    )
    mlp.fit(X_train, y_train)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(mlp, MODEL_PATH)
    return mlp, "trained_and_saved_once"


def _get_mlp_bundle() -> dict[str, Any]:
    """Load and cache digits_mlp.joblib once; train and save only if missing."""
    global _CACHED_BUNDLE
    if _CACHED_BUNDLE is not None:
        return _CACHED_BUNDLE

    with _CACHE_LOCK:
        if _CACHED_BUNDLE is not None:
            return _CACHED_BUNDLE

        digits = load_digits()
        if os.path.exists(MODEL_PATH):
            mlp = joblib.load(MODEL_PATH)
            load_mode = "loaded_from_disk"
        else:
            mlp, load_mode = _train_and_save_model(digits)

        metrics, report = _evaluate_on_split(mlp, digits)
        _CACHED_BUNDLE = {
            "mlp": mlp,
            "digits": digits,
            "metrics": metrics,
            "report": report,
            "load_mode": load_mode,
        }
        return _CACHED_BUNDLE


def predict_digit_canvas(pixels: Any = None) -> dict[str, Any]:
    """Predict digit (0-9) from an 8x8 (64 values) or 28x28 normalized/0-255 pixel array."""
    bundle = _get_mlp_bundle()
    mlp = bundle["mlp"]
    digits = bundle["digits"]
    metrics = bundle["metrics"]
    report = bundle["report"]

    if pixels is None:
        sample_vec = digits.data[0] / 16.0
    else:
        arr = np.asarray(pixels, dtype=float).flatten()
        if arr.size == 64:
            max_val = float(np.max(arr)) if np.max(arr) > 0 else 1.0
            sample_vec = arr / max_val if max_val > 1.0 else arr
        elif arr.size == 784:
            grid_28 = arr.reshape(28, 28)
            max_val = float(np.max(grid_28)) if np.max(grid_28) > 0 else 1.0
            norm_28 = grid_28 / max_val if max_val > 1.0 else grid_28
            sample_vec = np.array([
                norm_28[int(r * 3.5):int((r + 1) * 3.5), int(c * 3.5):int((c + 1) * 3.5)].mean()
                for r in range(8)
                for c in range(8)
            ])
        else:
            raise ValueError("'pixels' must contain 64 (8x8) or 784 (28x28) pixel values.")

    pred_digit = int(mlp.predict(sample_vec.reshape(1, -1))[0])
    probs = mlp.predict_proba(sample_vec.reshape(1, -1))[0]

    return {
        "task": "08_Neural_Network",
        "dataset": "scikit-learn load_digits (8x8, 1,797 samples)",
        "architecture": "Input(64) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Output(10, Softmax)",
        "model_artifact": "models/neural_network/digits_mlp.joblib",
        "model_cache_status": f"cached_in_memory ({bundle['load_mode']})",
        "retrained_on_request": False,
        "predicted_digit": pred_digit,
        "confidence": round(float(probs[pred_digit]), 4),
        "probabilities": {str(i): round(float(probs[i]), 4) for i in range(10)},
        "metrics": metrics,
        "classification_report": report,
    }