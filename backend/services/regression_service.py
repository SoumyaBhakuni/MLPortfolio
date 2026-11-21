import os
from typing import Any
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from config import Config
from utils.metrics import regression_metrics_dict
from utils.preprocessing import ensure_dir

def _load_housing_df() -> tuple[pd.DataFrame, bool]:
    csv_path = os.path.join(
        Config.ML_PROJECTS_DIR, "02_Linear_Regression", "dataset", "housing.csv"
    )
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path).dropna()
        if {"area_sqft", "price_usd"}.issubset(df.columns):
            return df[["area_sqft", "price_usd"]], False

    rng = np.random.default_rng(42)
    area = np.linspace(500, 4000, 120)
    noise = rng.normal(0, 22000, size=len(area))
    price = 45000 + 115.0 * area + noise
    return pd.DataFrame({"area_sqft": np.round(area, 1), "price_usd": np.round(price, 2)}), True

def _get_trained_model() -> tuple[LinearRegression, pd.DataFrame, dict[str, float]]:
    model_path = os.path.join(Config.MODELS_DIR, "regression", "linear_regression.joblib")
    df, is_synthetic = _load_housing_df()
    X = df[["area_sqft"]].values
    y = df["price_usd"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred_test = model.predict(X_test)
    metrics = regression_metrics_dict(y_test, y_pred_test)

    ensure_dir(os.path.dirname(model_path))
    joblib.dump(model, model_path)
    return model, df, metrics, is_synthetic


def predict_linear_regression(area_sqft: Any) -> dict[str, Any]:
    """Predict house price from predictor area_sqft and return regression metrics & curve."""
    try:
        area_val = float(area_sqft)
    except (TypeError, ValueError) as exc:
        raise ValueError("'area_sqft' must be a valid numeric value.") from exc

    if not np.isfinite(area_val) or area_val <= 0:
        raise ValueError("'area_sqft' must be a positive finite number.")

    model, df, metrics, is_synthetic = _get_trained_model()
    predicted_price = float(model.predict(np.array([[area_val]]))[0])

    x_min, x_max = float(df["area_sqft"].min()), float(df["area_sqft"].max())
    line_x = np.linspace(min(x_min, area_val), max(x_max, area_val), 25)
    line_y = model.predict(line_x.reshape(-1, 1))

    sample_points = [
        {"area_sqft": float(r["area_sqft"]), "price_usd": float(r["price_usd"])}
        for _, r in df.iloc[::4].iterrows()
    ]

    return {
        "task": "02_Linear_Regression",
        "feature": "area_sqft",
        "target": "price_usd",
        "input_area_sqft": round(area_val, 2),
        "predicted_price_usd": round(predicted_price, 2),
        "intercept": round(float(model.intercept_), 4),
        "slope": round(float(model.coef_[0]), 4),
        "metrics": metrics,
        "regression_line": {
            "x": [round(float(v), 2) for v in line_x],
            "y": [round(float(v), 2) for v in line_y],
        },
        "sample_points": sample_points,
        "is_synthetic": is_synthetic,
        "dataset_provenance": (
            "Synthetic demonstration data (seed=42, area_sqft in [500, 4000])"
            if is_synthetic
            else "Local CSV dataset (02_Linear_Regression/dataset/housing.csv)"
        ),
    }