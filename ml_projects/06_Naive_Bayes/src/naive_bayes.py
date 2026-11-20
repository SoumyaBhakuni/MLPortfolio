import os
import re
import json
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "classification", "naive_bayes.joblib")

DEFAULT_ROWS = [
    ("spam", "Win a free iPhone now! Click here to claim your prize."),
    ("spam", "URGENT! Your account has been selected for a cash reward. Reply WIN."),
    ("spam", "Congratulations! You won free entry to a contest. Text CLAIM."),
    ("spam", "Exclusive promo offer: low interest loan approved today."),
    ("spam", "Claim your free gift voucher by visiting our link now."),
    ("spam", "Call this number to collect your lottery reward!"),
    ("ham", "Hey are we still meeting for lunch at 1 pm near the library?"),
    ("ham", "Can you send me the notes from today's machine learning lecture?"),
    ("ham", "I will reach home in twenty minutes, let me know if you need anything."),
    ("ham", "Did you push the latest commit to the GitHub repository?"),
    ("ham", "Let's review the internship report draft tomorrow morning."),
    ("ham", "Don't forget to bring your laptop for the lab session."),
]


def load_or_create_sms() -> pd.DataFrame:
    os.makedirs(DATASET_DIR, exist_ok=True)
    csv_path = os.path.join(DATASET_DIR, "sms_spam.csv")
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path).dropna()
    df = pd.DataFrame(DEFAULT_ROWS, columns=["label", "message"])
    df.to_csv(csv_path, index=False)
    return df


def preprocess_text(text: str) -> str:
    cleaned = re.sub(r"[^a-z0-9\s]", " ", str(text).lower())
    return re.sub(r"\s+", " ", cleaned).strip()


def run_naive_bayes() -> dict:
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    df = load_or_create_sms()
    texts = [preprocess_text(t) for t in df["message"]]
    labels = [1 if str(lbl).strip().lower() == "spam" else 0 for lbl in df["label"]]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.25, random_state=42, stratify=labels
    )

    vectorizer = TfidfVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    clf = MultinomialNB(alpha=1.0)
    clf.fit(X_train_vec, y_train)
    joblib.dump({"vectorizer": vectorizer, "model": clf}, MODEL_PATH)

    preds = clf.predict(X_test_vec)
    acc = float(accuracy_score(y_test, preds))
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, preds, average="binary", zero_division=0)

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "report": classification_report(y_test, preds, target_names=["ham", "spam"], output_dict=True, zero_division=0),
    }
    with open(os.path.join(STATS_DIR, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    return {"accuracy": metrics["accuracy"], "f1_score": metrics["f1_score"]}


if __name__ == "__main__":
    print("Task 06 Naive Bayes:", run_naive_bayes())