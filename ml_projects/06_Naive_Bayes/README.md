# Task 06 — Naive Bayes Text Classification (Spam Detection)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `06_Naive_Bayes` — `MultinomialNB` + `TfidfVectorizer`
- **Dataset:** SMS Spam Collection (`dataset/sms_spam.csv`)
- **API Endpoint:** `/api/task06/predict`

## Overview
Preprocesses and vectorizes SMS text messages using `TfidfVectorizer`, trains a `MultinomialNB` classifier to distinguish Spam from Ham messages, and returns predicted labels, class probabilities, and evaluation metrics.

## How to Run
```bash
python3 ml_projects/06_Naive_Bayes/src/naive_bayes.py