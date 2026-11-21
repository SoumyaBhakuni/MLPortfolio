import os
import re
from typing import Any
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from config import Config
from utils.metrics import classification_metrics_dict
from utils.preprocessing import ensure_dir

_MODEL_CACHE = None


def _preprocess_text(text: str) -> str:
    lowered = str(text).lower().strip()
    cleaned = re.sub(r"[^a-z0-9\s]", " ", lowered)
    return re.sub(r"\s+", " ", cleaned).strip()


def _load_or_train_nb():
    global _MODEL_CACHE
    if _MODEL_CACHE is not None:
        return _MODEL_CACHE

    model_path = os.path.join(Config.MODELS_DIR, "classification", "naive_bayes.joblib")
    if os.path.exists(model_path):
        bundle = joblib.load(model_path)
        _MODEL_CACHE = (bundle["vectorizer"], bundle["model"], bundle.get("metrics", {}))
        return _MODEL_CACHE

    csv_path = os.path.abspath(
        os.path.join(Config.BASE_DIR, "..", "ml_projects", "06_Naive_Bayes", "dataset", "sms_spam.csv")
    )
    df = pd.read_csv(csv_path).dropna(subset=["label", "message"])
    df["label"] = df["label"].astype(str).str.strip().str.lower()
    df = df[df["label"].isin(["ham", "spam"])]

    texts = [_preprocess_text(t) for t in df["message"]]
    labels = [1 if lbl == "spam" else 0 for lbl in df["label"]]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    clf = MultinomialNB(alpha=0.5)
    clf.fit(X_train_vec, y_train)
    preds_test = clf.predict(X_test_vec)
    metrics = classification_metrics_dict(y_test, preds_test, labels=[0, 1], average="binary")

    ensure_dir(os.path.dirname(model_path))
    joblib.dump({"vectorizer": vectorizer, "model": clf, "metrics": metrics}, model_path)
    _MODEL_CACHE = (vectorizer, clf, metrics)
    return _MODEL_CACHE


def predict_spam_message(message: Any) -> dict[str, Any]:
    """Classify an SMS/text message as Spam or Not Spam using Multinomial Naive Bayes."""
    if not isinstance(message, str) or not message.strip():
        raise ValueError("'message' must be a non-empty string.")

    vectorizer, clf, metrics = _load_or_train_nb()
    processed = _preprocess_text(message)
    vec = vectorizer.transform([processed])
    pred_label = int(clf.predict(vec)[0])
    probs = clf.predict_proba(vec)[0]

    feature_names = vectorizer.get_feature_names_out()
    spam_log_probs = clf.feature_log_prob_[1]
    top_spam_indices = spam_log_probs.argsort()[::-1][:8]
    top_spam_tokens = [str(feature_names[i]) for i in top_spam_indices]

    return {
        "task": "06_Naive_Bayes",
        "input_message": message,
        "processed_text": processed,
        "prediction": "Spam" if pred_label == 1 else "Not Spam",
        "is_spam": pred_label == 1,
        "probabilities": {
            "not_spam": round(float(probs[0]), 4),
            "spam": round(float(probs[1]), 4),
        },
        "top_spam_indicators": top_spam_tokens,
        "metrics": metrics,
    }