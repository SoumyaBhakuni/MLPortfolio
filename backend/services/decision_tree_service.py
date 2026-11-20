import os
from typing import Any
import joblib
import numpy as np
from sklearn.datasets import load_iris
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text
from config import Config
from utils.metrics import classification_metrics_dict
from utils.preprocessing import ensure_dir


def predict_decision_tree(
    features: list[float] | None = None, max_depth: Any = 3
) -> dict[str, Any]:
    """Train Decision Tree on Iris, evaluate test metrics, and predict class for input features."""
    try:
        depth = int(max_depth)
    except (TypeError, ValueError) as exc:
        raise ValueError("'max_depth' must be an integer.") from exc

    if depth < 1 or depth > 12:
        raise ValueError("'max_depth' must be between 1 and 12.")

    if features is None:
        sample = [5.1, 3.5, 1.4, 0.2]
    else:
        if not isinstance(features, list) or len(features) != 4:
            raise ValueError("'features' must be a list of 4 numerical values.")
        try:
            sample = [float(x) for x in features]
        except (TypeError, ValueError) as exc:
            raise ValueError("All elements in 'features' must be numeric.") from exc

    iris = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(
        iris.data, iris.target, test_size=0.25, random_state=42, stratify=iris.target
    )

    clf = DecisionTreeClassifier(max_depth=depth, random_state=42)
    clf.fit(X_train, y_train)
    y_pred_test = clf.predict(X_test)

    metrics = classification_metrics_dict(
        y_test, y_pred_test, labels=[0, 1, 2], average="weighted"
    )
    report = classification_report(
        y_test, y_pred_test, target_names=list(iris.target_names), output_dict=True, zero_division=0
    )

    model_dir = ensure_dir(os.path.join(Config.MODELS_DIR, "classification"))
    joblib.dump(clf, os.path.join(model_dir, "decision_tree.joblib"))

    pred_idx = int(clf.predict(np.array([sample], dtype=float))[0])
    probs = clf.predict_proba(np.array([sample], dtype=float))[0]

    return {
        "task": "05_Decision_Tree",
        "max_depth": depth,
        "feature_names": list(iris.feature_names),
        "input_features": sample,
        "predicted_class": str(iris.target_names[pred_idx]),
        "probabilities": {
            str(iris.target_names[i]): round(float(probs[i]), 4)
            for i in range(len(iris.target_names))
        },
        "metrics": metrics,
        "classification_report": report,
        "tree_rules": export_text(clf, feature_names=list(iris.feature_names)),
    }