import os
import json
import joblib
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, confusion_matrix, ConfusionMatrixDisplay
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "classification", "svm.joblib")


def run_svm(kernel: str = "rbf", c_val: float = 1.0, gamma: str | float = "scale") -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    iris = load_iris()
    mask = iris.target < 2
    X = iris.data[mask]
    y = iris.target[mask]
    class_names = [str(iris.target_names[0]), str(iris.target_names[1])]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    clf = SVC(kernel=kernel, C=c_val, gamma=gamma, probability=True, random_state=42)
    clf.fit(X_train_s, y_train)
    joblib.dump({"model": clf, "scaler": scaler}, MODEL_PATH)

    preds = clf.predict(X_test_s)
    acc = float(accuracy_score(y_test, preds))
    cm = confusion_matrix(y_test, preds)

    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)
    disp.plot(cmap="Greens")
    plt.title(f"SVM ({kernel}, C={c_val}) Confusion Matrix")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "confusion_matrix.png"), dpi=150)
    plt.close()

    summary = {
        "kernel": kernel,
        "C": c_val,
        "gamma": gamma,
        "accuracy": round(acc, 4),
        "support_vectors_count": int(clf.n_support_.sum()),
    }
    with open(os.path.join(STATS_DIR, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary


if __name__ == "__main__":
    print("Task 10 SVM:", run_svm("rbf", 1.0, "scale"))