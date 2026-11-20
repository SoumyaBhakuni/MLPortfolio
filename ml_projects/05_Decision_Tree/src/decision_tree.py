import os
import json
import joblib
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "classification", "decision_tree.joblib")


def run_decision_tree(max_depth: int = 3) -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    iris = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(
        iris.data, iris.target, test_size=0.25, random_state=42, stratify=iris.target
    )

    clf = DecisionTreeClassifier(max_depth=max_depth, random_state=42)
    clf.fit(X_train, y_train)
    joblib.dump(clf, MODEL_PATH)

    y_pred = clf.predict(X_test)
    acc = float(accuracy_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred)

    plt.figure(figsize=(12, 7))
    plot_tree(clf, feature_names=list(iris.feature_names), class_names=list(iris.target_names), filled=True)
    plt.title(f"Decision Tree (max_depth={max_depth})")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "tree_diagram.png"), dpi=150)
    plt.close()

    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=list(iris.target_names))
    disp.plot(cmap="Blues")
    plt.title("Decision Tree Confusion Matrix")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "confusion_matrix.png"), dpi=150)
    plt.close()

    report = classification_report(
        y_test, y_pred, target_names=list(iris.target_names), output_dict=True, zero_division=0
    )
    summary = {"max_depth": max_depth, "accuracy": round(acc, 4), "report": report}
    with open(os.path.join(STATS_DIR, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return {"max_depth": max_depth, "accuracy": round(acc, 4)}


if __name__ == "__main__":
    print("Task 05 Decision Tree:", run_decision_tree(3))