from typing import Any
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
)


def regression_metrics_dict(y_true: Any, y_pred: Any) -> dict[str, float]:
    """Compute standard regression evaluation metrics."""
    y_t = np.asarray(y_true, dtype=float)
    y_p = np.asarray(y_pred, dtype=float)
    mse = float(mean_squared_error(y_t, y_p))
    rmse = float(np.sqrt(mse))
    mae = float(mean_absolute_error(y_t, y_p))
    r2 = float(r2_score(y_t, y_p)) if len(y_t) > 1 else 0.0
    return {
        "mse": round(mse, 6),
        "rmse": round(rmse, 6),
        "mae": round(mae, 6),
        "r2": round(r2, 6),
    }


def classification_metrics_dict(
    y_true: Any,
    y_pred: Any,
    labels: list[Any] | None = None,
    average: str = "weighted",
) -> dict[str, Any]:
    """Compute classification metrics and confusion matrix."""
    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, average=average, zero_division=0))
    rec = float(recall_score(y_true, y_pred, average=average, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, average=average, zero_division=0))
    cm = confusion_matrix(y_true, y_pred, labels=labels).tolist()
    return {
        "accuracy": round(acc, 6),
        "precision": round(prec, 6),
        "recall": round(rec, 6),
        "f1_score": round(f1, 6),
        "confusion_matrix": cm,
    }