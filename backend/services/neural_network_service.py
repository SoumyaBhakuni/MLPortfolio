from typing import Any
import numpy as np
from sklearn.datasets import load_digits
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from utils.metrics import classification_metrics_dict


def _build_mlp_digits():
    digits = load_digits()
    X = digits.data / 16.0
    y = digits.target
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    mlp = MLPClassifier(
        hidden_layer_sizes=(64, 32),
        activation="relu",
        max_iter=300,
        random_state=42,
    )
    mlp.fit(X_train, y_train)
    preds = mlp.predict(X_test)
    metrics = classification_metrics_dict(
        y_test, preds, labels=list(range(10)), average="weighted"
    )
    report = classification_report(y_test, preds, output_dict=True, zero_division=0)
    return mlp, digits, metrics, report


def predict_digit_canvas(pixels: Any = None) -> dict[str, Any]:
    """Predict digit (0-9) from an 8x8 (64 values) or 28x28 normalized/0-255 pixel array."""
    mlp, digits, metrics, report = _build_mlp_digits()

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
            # Downsample 28x28 to 8x8 via block averages
            sample_vec = norm_28.reshape(8, 3, 8, 3).mean(axis=(1, 3)).flatten() if False else np.array([
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
        "architecture": "Input(64) -> Dense(64, ReLU) -> Dense(32, ReLU) -> Output(10, Softmax)",
        "predicted_digit": pred_digit,
        "confidence": round(float(probs[pred_digit]), 4),
        "probabilities": {str(i): round(float(probs[i]), 4) for i in range(10)},
        "metrics": metrics,
        "classification_report": report,
    }