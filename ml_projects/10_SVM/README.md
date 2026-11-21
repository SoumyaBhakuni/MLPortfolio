# Task 10 — Support Vector Machine (Binary Classification)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `10_SVM` — `SVC` with `StandardScaler` on Setosa vs. Versicolor
- **Dataset:** Iris Flower Dataset (filtered to two species: *Setosa* and *Versicolor*)
- **API Endpoint:** `/api/task10/predict`

## Overview
Standardizes features with `StandardScaler` and trains a binary Support Vector Classifier (`SVC`) separating *Setosa* and *Versicolor* with configurable kernel, `C`, and `gamma` parameters, reporting test accuracy, confusion matrix metrics, and support vector counts.

## How to Run
```bash
python3 ml_projects/10_SVM/src/svm.py