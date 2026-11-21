import json
import os
import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

SRC_DIR = os.path.dirname(os.path.abspath(__file__))
TASK_DIR = os.path.abspath(os.path.join(SRC_DIR, ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(SRC_DIR, "..", "..", ".."))
DATASET_DIR = os.path.join(TASK_DIR, "dataset")
CSV_PATH = os.path.join(DATASET_DIR, "monthly_sales.csv")
GRAPHS_DIR = os.path.join(TASK_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(TASK_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "time_series", "arima_model.joblib")


def load_series() -> pd.Series:
    """Load monthly_sales.csv indexed by date."""
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(
            f"Expected dataset at '{CSV_PATH}'. Ensure monthly_sales.csv is present."
        )

    df = pd.read_csv(CSV_PATH)
    if "date" not in df.columns or "sales" not in df.columns:
        raise ValueError("monthly_sales.csv must contain 'date' and 'sales' columns.")

    df["date"] = pd.to_datetime(df["date"])
    df = df.dropna(subset=["date", "sales"]).sort_values("date")
    series = df.set_index("date")["sales"].astype(float)

    if len(series) < 12:
        raise ValueError("monthly_sales.csv must have at least 12 rows.")

    return series


def run_adf(values: np.ndarray, label: str) -> dict:
    clean = np.asarray(values, dtype=float)
    clean = clean[~np.isnan(clean)]
    stat, p_val, used_lag, n_obs, crit_vals, _ = adfuller(clean, autolag="AIC")
    return {
        "label": label,
        "n_obs": int(n_obs),
        "lags_used": int(used_lag),
        "adf_stat": round(float(stat), 4),
        "p_value": round(float(p_val), 6),
        "critical_values": {k: round(float(v), 4) for k, v in crit_vals.items()},
        "is_stationary_5pct": bool(p_val < 0.05),
    }


def run_arima(steps: int = 6, order: tuple[int, int, int] = (1, 1, 1)) -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    p, d, q = int(order[0]), int(order[1]), int(order[2])
    series = load_series()
    values = series.to_numpy(dtype=float)

    raw_adf = run_adf(values, "raw_series")
    diff_adf = run_adf(np.diff(values, n=d), f"diff_{d}") if d > 0 else None

    max_lags = min(12, max(1, len(series) // 2 - 1))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    plot_acf(series, lags=max_lags, ax=axes[0])
    plot_pacf(series, lags=max_lags, ax=axes[1], method="ywm")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "acf_pacf.png"), dpi=150)
    plt.close()

    # Train/test holdout evaluation (last 6 observations held out)
    holdout_size = min(6, max(1, len(values) // 4))
    train_vals = values[:-holdout_size]
    test_vals = values[-holdout_size:]
    val_fitted = ARIMA(train_vals, order=(p, d, q)).fit()
    val_pred = np.asarray(val_fitted.forecast(steps=holdout_size), dtype=float)
    mae = float(np.mean(np.abs(test_vals - val_pred)))
    rmse = float(np.sqrt(np.mean((test_vals - val_pred) ** 2)))

    # Fit on full historical series for final forecast
    model = ARIMA(series, order=(p, d, q))
    fitted = model.fit()
    joblib.dump(fitted, MODEL_PATH)

    forecast_vals = fitted.forecast(steps=steps)
    future_dates = pd.date_range(
        series.index[-1] + pd.offsets.MonthBegin(1), periods=steps, freq="MS"
    )

    plt.figure(figsize=(9, 4.5))
    plt.plot(series.index, series.values, label="Historical", color="#22D3EE")
    plt.plot(
        series.index,
        fitted.fittedvalues,
        label=f"Fitted ARIMA({p},{d},{q})",
        color="#F59E0B",
        linestyle="--",
        alpha=0.85,
    )
    plt.plot(
        future_dates,
        forecast_vals.values,
        label="Forecast",
        color="#10B981",
        marker="o",
    )
    plt.title(f"ARIMA({p},{d},{q}) Fit & {steps}-Period Forecast")
    plt.xlabel("Date")
    plt.ylabel("Sales")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "forecast.png"), dpi=150)
    plt.close()

    summary = {
        "task": "09_ARIMA",
        "dataset_source": "ml_projects/09_ARIMA/dataset/monthly_sales.csv",
        "is_synthetic_dataset": True,
        "order": [p, d, q],
        "steps": steps,
        "aic": round(float(fitted.aic), 4),
        "bic": round(float(fitted.bic), 4),
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "stationarity": {
            "raw_adf": raw_adf,
            "differenced_adf": diff_adf,
        },
        "validation_split": {
            "train_size": int(len(train_vals)),
            "test_size": int(holdout_size),
        },
        "forecast": [round(float(v), 2) for v in forecast_vals.values],
    }
    with open(os.path.join(STATS_DIR, "forecast_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary


if __name__ == "__main__":
    print("Task 09 ARIMA:", run_arima(6, (1, 1, 1)))