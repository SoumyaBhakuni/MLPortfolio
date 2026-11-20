import os
from typing import Any
import joblib
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from config import Config
from utils.metrics import classification_metrics_dict
from utils.preprocessing import ensure_dir


def predict_svm(
    features: list[float] | None = None,
    kernel: str = "rbf",
    c_value: Any = 1.0,
    gamma: Any = "scale",
) -> dict[str, Any]:
    """Train binary SVM on two Iris species (Setosa vs Versicolor) and predict class."""
    allowed_kernels = {"linear", "rbf", "poly", "sigmoid"}
    if kernel not in allowed_kernels:
        raise ValueError(f"'kernel' must be one of {sorted(allowed_kernels)}.")

    try:
        c_float = float(c_value)
    except (TypeError, ValueError) as exc:
        raise ValueError("'c_value' must be a positive number.") from exc

    if not np.isfinite(c_float) or c_float <= 0:
        raise ValueError("'c_value' must be greater than 0.")

    if isinstance(gamma, str):
        if gamma not in {"scale", "auto"}:
            raise ValueError("String 'gamma' must be 'scale' or 'auto'.")
        gamma_param: float | str = gamma
    else:
        try:
            gamma_param = float(gamma)
        except (TypeError, ValueError) as exc:
            raise ValueError("'gamma' must be 'scale', 'auto', or a positive float.") from exc
        if not np.isfinite(gamma_param) or gamma_param <= 0:
            raise ValueError("Numeric 'gamma' must be greater than 0.")

    if features is None:
        sample = [5.0, 3.4, 1.5, 0.2]
    else:
        if not isinstance(features, list) or len(features) != 4:
            raise ValueError("'features' must be a list of 4 numerical values.")
        try:
            sample = [float(x) for x in features]
        except (TypeError, ValueError) as exc:
            raise ValueError("All elements in 'features' must be numeric.") from exc

    iris = load_iris()
    mask = iris.target < 2
    X_bin = iris.data[mask]
    y_bin = iris.target[mask]
    class_names = [str(iris.target_names[0]), str(iris.target_names[1])]

    X_train, X_test, y_train, y_test = train_test_split(
        X_bin, y_bin, test_size=0.25, random_state=42, stratify=y_bin
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    clf = SVC(kernel=kernel, C=c_float, gamma=gamma_param, probability=True, random_state=42)
    clf.fit(X_train_s, y_train)
    y_pred_test = clf.predict(X_test_s)

    metrics = classification_metrics_dict(
        y_test, y_pred_test, labels=[0, 1], average="binary"
    )

    model_dir = ensure_dir(os.path.join(Config.MODELS_DIR, "classification"))
    joblib.dump({"model": clf, "scaler": scaler}, os.path.join(model_dir, "svm.joblib"))

    sample_s = scaler.transform(np.array([sample], dtype=float))
    pred_idx = int(clf.predict(sample_s)[0])
    probs = clf.predict_proba(sample_s)[0]

    return {
        "task": "10_SVM",
        "kernel": kernel,
        "C": c_float,
        "gamma": gamma_param,
        "species_pair": class_names,
        "feature_names": list(iris.feature_names),
        "input_features": sample,
        "predicted_class": class_names[pred_idx],
        "probabilities": {
            class_names[0]: round(float(probs[0]), 4),
            class_names[1]: round(float(probs[1]), 4),
        },
        "support_vectors_count": int(clf.n_support_.sum()),
        "support_vectors_per_class": {
            class_names[0]: int(clf.n_support_[0]),
            class_names[1]: int(clf.n_support_[1]),
        },
        "metrics": metrics,
    }