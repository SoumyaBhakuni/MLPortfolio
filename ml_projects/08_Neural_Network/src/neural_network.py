import os
import json
import joblib
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, ConfusionMatrixDisplay
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "neural_network", "digits_mlp.joblib")


def run_neural_network() -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    digits = load_digits()
    X = digits.data / 16.0
    y = digits.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    mlp = MLPClassifier(hidden_layer_sizes=(64, 32), activation="relu", max_iter=300, random_state=42)
    mlp.fit(X_train, y_train)
    joblib.dump(mlp, MODEL_PATH)

    preds = mlp.predict(X_test)
    acc = float(accuracy_score(y_test, preds))
    cm = confusion_matrix(y_test, preds)

    plt.figure(figsize=(7, 4))
    plt.plot(mlp.loss_curve_, color="#F43F5E")
    plt.title("Training Loss Curve (ReLU MLP)")
    plt.xlabel("Iteration")
    plt.ylabel("Loss")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "training_loss.png"), dpi=150)
    plt.close()

    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot(cmap="Purples")
    plt.title("Digit Classifier Confusion Matrix")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "confusion_matrix.png"), dpi=150)
    plt.close()

    metrics = {
        "test_accuracy": round(acc, 4),
        "n_iter": int(mlp.n_iter_),
        "report": classification_report(y_test, preds, output_dict=True, zero_division=0),
    }
    with open(os.path.join(STATS_DIR, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    return {"test_accuracy": metrics["test_accuracy"], "n_iter": metrics["n_iter"]}


if __name__ == "__main__":
    print("Task 08 Neural Network:", run_neural_network())