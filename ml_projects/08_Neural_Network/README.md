# Task 08 — Neural Network (Handwritten Digit Recognition)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `08_Neural_Network` — Multi-Layer Perceptron (`MLPClassifier` with `ReLU` hidden layers and softmax output probabilities)
- **Dataset:** Scikit-Learn Digits Dataset (`load_digits`: 1,797 samples, `8×8` pixel grids across digits `0–9`)
- **API Endpoint:** `/api/task08/predict`

## Overview
Trains and evaluates an `MLPClassifier` on the `8×8` scikit-learn Digits dataset, saves `models/neural_network/digits_mlp.joblib`, and serves cached inference on `8×8` canvas inputs without retraining per request.

## How to Run
```bash
python3 ml_projects/08_Neural_Network/src/neural_network.py