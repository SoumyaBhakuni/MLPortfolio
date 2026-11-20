import os
import re
from typing import Any
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from config import Config
from utils.metrics import classification_metrics_dict
from utils.preprocessing import ensure_dir

_SAMPLE_CORPUS = [
    ("Win a free iPhone now! Click here to claim your cash prize immediately.", 1),
    ("URGENT! Your account has been selected for a $1000 reward. Reply WIN.", 1),
    ("Congratulations! You won free entry to a weekly contest. Text CLAIM now.", 1),
    ("Limited time offer: cheap loans approved instantly with zero credit check.", 1),
    ("Free ringtones and exclusive bonus credits waiting for you today.", 1),
    ("Hey are we still meeting for lunch at 1 pm near the library?", 0),
    ("Can you send me the notes from today's machine learning lecture?", 0),
    ("I will reach home in twenty minutes, let me know if you need groceries.", 0),
    ("Did you push the latest commit to the GitHub repository?", 0),
    ("Let's review the internship report draft tomorrow morning.", 0),
    ("Claim your free gift card today by visiting our promo link.", 1),
    ("Call this number now to collect your lottery voucher!", 1),
    ("Reminder: team sync starts in ten minutes on the project channel.", 0),
    ("Thanks for helping debug the API route earlier.", 0),
    ("Exclusive deal just for you: buy one get one free voucher code.", 1),
    ("Don't forget to bring your laptop for the lab session.", 0),
]


def _preprocess_text(text: str) -> str:
    lowered = text.lower().strip()
    cleaned = re.sub(r"[^a-z0-9\s]", " ", lowered)
    return re.sub(r"\s+", " ", cleaned).strip()


def _train_or_load_nb():
    model_path = os.path.join(Config.MODELS_DIR, "classification", "naive_bayes.joblib")
    texts = [_preprocess_text(t) for t, _ in _SAMPLE_CORPUS]
    labels = [y for _, y in _SAMPLE_CORPUS]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.25, random_state=42, stratify=labels
    )

    vectorizer = TfidfVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    clf = MultinomialNB(alpha=1.0)
    clf.fit(X_train_vec, y_train)
    preds_test = clf.predict(X_test_vec)
    metrics = classification_metrics_dict(y_test, preds_test, labels=[0, 1], average="binary")

    ensure_dir(os.path.dirname(model_path))
    joblib.dump({"vectorizer": vectorizer, "model": clf}, model_path)
    return vectorizer, clf, metrics


def predict_spam_message(message: Any) -> dict[str, Any]:
    """Classify an SMS/text message as Spam or Not Spam using Multinomial Naive Bayes."""
    if not isinstance(message, str) or not message.strip():
        raise ValueError("'message' must be a non-empty string.")

    vectorizer, clf, metrics = _train_or_load_nb()
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