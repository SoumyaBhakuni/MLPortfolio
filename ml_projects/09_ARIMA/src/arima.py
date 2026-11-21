import json
import os
import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima.model import ARIMA

TASK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(TASK_DIR, "..", ".."))
DATASET_DIR = os.path.join(TASK_DIR, "dataset")
GRAPHS_DIR = os.path.join(TASK_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(TASK_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "time_series", "arima_model.joblib")


def load_or_create_series() -> pd.DataFrame:
    os.makedirs(DATASET_DIR, exist_ok=True)
    csv_path = os.path.join(DATASET_DIR, "monthly_sales.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        df["date"] = pd.to_datetime(df["date"])
        return df.set_index("date")

    dates = pd.date_range("2023-01-01", periods=36, freq="MS")
    t = np.arange(1, 37, dtype=float)
    values = 120.0 + 3.5 * t + 14.0 * np.sin(2 * np.pi * t / 12.0)
    df = pd.DataFrame({"date": dates, "sales": np.round(values, 2)})
    df.to_csv(csv_path, index=False)
    return df.set_index("date")


def run_arima(steps: int = 6, order: tuple[int, int, int] = (1, 1, 1)) -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    df = load_or_create_series()
    series = df["sales"].astype(float)

    max_lags = min(12, max(1, len(series) // 2 - 1))
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    plot_acf(series, lags=max_lags, ax=axes[0])
    plot_pacf(series, lags=max_lags, ax=axes[1], method="ywm")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "acf_pacf.png"), dpi=150)
    plt.close()

    model = ARIMA(series, order=order)
    fitted = model.fit()
    joblib.dump(fitted, MODEL_PATH)

    forecast_vals = fitted.forecast(steps=steps)
    future_dates = pd.date_range(
        series.index[-1] + pd.offsets.MonthBegin(1), periods=steps, freq="MS"
    )

    plt.figure(figsize=(9, 4.5))
    plt.plot(series.index, series.values, label="Historical", color="#22D3EE")
    plt.plot(future_dates, forecast_vals.values, label="Forecast", color="#10B981", marker="o")
    plt.title(f"ARIMA{order} Forecast ({steps} Periods)")
    plt.xlabel("Date")
    plt.ylabel("Sales")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "forecast.png"), dpi=150)
    plt.close()

    train_hist = series.values[:-6]
    test_hist = series.values[-6:]
    val_pred = ARIMA(train_hist, order=order).fit().forecast(steps=len(test_hist))
    mae = float(np.mean(np.abs(test_hist - val_pred)))
    rmse = float(np.sqrt(np.mean((test_hist - val_pred) ** 2)))

    summary = {
        "order": list(order),
        "steps": steps,
        "aic": round(float(fitted.aic), 4),
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "forecast": [round(float(v), 2) for v in forecast_vals.values],
    }
    with open(os.path.join(STATS_DIR, "forecast_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary


if __name__ == "__main__":
    print("Task 09 ARIMA:", run_arima(6, (1, 1, 1)))