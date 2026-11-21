import json
import os
import re
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

# Use ("..") if this file is inside 06_Naive_Bayes/src/, or os.path.dirname(__file__) if directly in 06_Naive_Bayes/
TASK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(TASK_DIR, "..", ".."))
CSV_PATH = os.path.join(TASK_DIR, "dataset", "sms_spam.csv")
STATS_DIR = os.path.join(TASK_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "classification", "naive_bayes.joblib")


def preprocess_text(text: str) -> str:
    cleaned = re.sub(r"[^a-z0-9\s]", " ", str(text).lower())
    return re.sub(r"\s+", " ", cleaned).strip()


def load_sms_dataset(csv_path: str = CSV_PATH) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"SMS dataset not found at {csv_path}. Place sms_spam.csv there first.")
    df = pd.read_csv(csv_path)
    if {"v1", "v2"}.issubset(df.columns):
        df = df[["v1", "v2"]].rename(columns={"v1": "label", "v2": "message"})
    elif not {"label", "message"}.issubset(df.columns):
        raise ValueError("sms_spam.csv must contain 'label' and 'message' columns.")
    df = df.dropna(subset=["label", "message"]).copy()
    df["label"] = df["label"].astype(str).str.strip().str.lower()
    df = df[df["label"].isin(["ham", "spam"])]
    return df


def run_naive_bayes() -> dict:
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    df = load_sms_dataset()
    texts = [preprocess_text(t) for t in df["message"]]
    labels = [1 if lbl == "spam" else 0 for lbl in df["label"]]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    clf = MultinomialNB(alpha=0.5)
    clf.fit(X_train_vec, y_train)
    joblib.dump({"vectorizer": vectorizer, "model": clf}, MODEL_PATH)

    preds = clf.predict(X_test_vec)
    acc = float(accuracy_score(y_test, preds))
    prec, rec, f1, _ = precision_recall_fscore_support(
        y_test, preds, average="binary", zero_division=0
    )

    metrics = {
        "dataset_size": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "report": classification_report(
            y_test, preds, target_names=["ham", "spam"], output_dict=True, zero_division=0
        ),
    }
    with open(os.path.join(STATS_DIR, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    return {
        "dataset_size": metrics["dataset_size"],
        "accuracy": metrics["accuracy"],
        "precision": metrics["precision"],
        "recall": metrics["recall"],
        "f1_score": metrics["f1_score"],
    }


if __name__ == "__main__":
    print("Task 06 Naive Bayes:", run_naive_bayes())