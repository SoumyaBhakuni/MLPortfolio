import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "regression", "linear_regression.joblib")


def load_or_create_housing() -> pd.DataFrame:
    os.makedirs(DATASET_DIR, exist_ok=True)
    csv_path = os.path.join(DATASET_DIR, "housing.csv")
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path).dropna()

    rng = np.random.default_rng(42)
    area = np.linspace(500, 4000, 150)
    price = 45000.0 + 115.0 * area + rng.normal(0, 22000, size=len(area))
    df = pd.DataFrame({"area_sqft": np.round(area, 2), "price_usd": np.round(price, 2)})
    df.to_csv(csv_path, index=False)
    return df


def run_linear_regression() -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    df = load_or_create_housing()
    X = df[["area_sqft"]].values
    y = df["price_usd"].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    joblib.dump(model, MODEL_PATH)

    y_pred = model.predict(X_test)
    mse = float(mean_squared_error(y_test, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_test, y_pred))

    plt.figure(figsize=(8, 5))
    plt.scatter(X_test, y_test, alpha=0.7, label="Actual Test Data")
    x_grid = np.linspace(X.min(), X.max(), 100).reshape(-1, 1)
    plt.plot(x_grid, model.predict(x_grid), color="#10B981", linewidth=2, label="OLS Regression Line")
    plt.title("Simple Linear Regression: House Price vs Area (sq ft)")
    plt.xlabel("Area (sq ft)")
    plt.ylabel("Price (USD)")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "regression_fit.png"), dpi=150)
    plt.close()

    metrics = {
        "intercept": round(float(model.intercept_), 4),
        "slope": round(float(model.coef_[0]), 4),
        "mse": round(mse, 4),
        "rmse": round(rmse, 4),
        "r2": round(r2, 4),
    }
    with open(os.path.join(STATS_DIR, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    return metrics


if __name__ == "__main__":
    print("Task 02 Linear Regression:", run_linear_regression())