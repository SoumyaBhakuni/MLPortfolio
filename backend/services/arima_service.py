import os
from typing import Any
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_DIR, ".."))
MONTHLY_SALES_CSV = os.path.join(
    PROJECT_ROOT, "ml_projects", "09_ARIMA", "dataset", "monthly_sales.csv"
)


def _load_sales_series() -> tuple[pd.Series, str]:
    """Load the monthly_sales.csv series indexed by date."""
    if not os.path.exists(MONTHLY_SALES_CSV):
        raise FileNotFoundError(
            f"ARIMA dataset not found at '{MONTHLY_SALES_CSV}'."
        )

    df = pd.read_csv(MONTHLY_SALES_CSV)
    if "date" not in df.columns or "sales" not in df.columns:
        raise ValueError(
            "monthly_sales.csv must contain 'date' and 'sales' columns."
        )

    df["date"] = pd.to_datetime(df["date"])
    df = df.dropna(subset=["date", "sales"]).sort_values("date")
    series = df.set_index("date")["sales"].astype(float)

    if len(series) < 12:
        raise ValueError(
            "monthly_sales.csv must contain at least 12 observations for train/test evaluation."
        )

    return series, MONTHLY_SALES_CSV


def _adf_summary(values: np.ndarray, label: str) -> dict[str, Any]:
    """Run ADF stationarity test safely on a 1D array."""
    clean = np.asarray(values, dtype=float)
    clean = clean[~np.isnan(clean)]
    if len(clean) < 4:
        return {
            "label": label,
            "n_obs": int(len(clean)),
            "adf_stat": None,
            "p_value": None,
            "is_stationary": False,
            "note": "Insufficient observations for ADF test.",
        }

    stat, p_val, used_lag, n_obs, crit_vals, _ = adfuller(clean, autolag="AIC")
    return {
        "label": label,
        "n_obs": int(n_obs),
        "lags_used": int(used_lag),
        "adf_stat": round(float(stat), 4),
        "p_value": round(float(p_val), 6),
        "critical_values": {k: round(float(v), 4) for k, v in crit_vals.items()},
        "is_stationary": bool(p_val < 0.05),
    }


def _build_order_justification(
    p: int,
    d: int,
    q: int,
    raw_adf: dict[str, Any],
    diff_adf: dict[str, Any] | None,
    fitted_model: Any,
) -> dict[str, Any]:
    """Explain differencing order d and (p, d, q) selection."""
    if d == 0:
        d_reason = (
            f"d=0 selected (raw series ADF p={raw_adf.get('p_value')}); "
            "no differencing applied."
        )
    else:
        diff_p = diff_adf.get("p_value") if diff_adf else None
        d_reason = (
            f"d={d} differencing applied to address trend/non-stationarity "
            f"(raw ADF p={raw_adf.get('p_value')}, post-differencing ADF p={diff_p})."
        )

    pq_reason = (
        f"Order ({p}, {d}, {q}) fits {p} autoregressive lag(s), {d} difference(s), "
        f"and {q} moving-average lag(s) on the monthly sales series; compare AIC "
        f"({round(float(fitted_model.aic), 4)}) and BIC ({round(float(fitted_model.bic), 4)}) "
        "alongside ACF/PACF cutoffs when tuning candidate orders."
    )

    return {
        "differencing": d_reason,
        "pq_selection": pq_reason,
        "aic": round(float(fitted_model.aic), 4),
        "bic": round(float(fitted_model.bic), 4),
    }


def forecast_arima(
    steps: Any = 6, order: Any = None
) -> dict[str, Any]:
    """Fit ARIMA(p, d, q) on monthly_sales.csv and return historical, fitted, and forecast data."""
    try:
        horizon = int(steps)
    except (TypeError, ValueError) as exc:
        raise ValueError("'steps' must be an integer.") from exc

    if horizon < 1 or horizon > 24:
        raise ValueError("'steps' must be between 1 and 24.")

    if order is None:
        p, d, q = 1, 1, 1
    else:
        if not isinstance(order, (list, tuple)) or len(order) != 3:
            raise ValueError("'order' must be a 3-element list [p, d, q].")
        try:
            p, d, q = int(order[0]), int(order[1]), int(order[2])
        except (TypeError, ValueError) as exc:
            raise ValueError("ARIMA order values [p, d, q] must be integers.") from exc
        if min(p, d, q) < 0 or max(p, d, q) > 5:
            raise ValueError("ARIMA order values must be between 0 and 5.")

    series, source_path = _load_sales_series()
    values = series.to_numpy(dtype=float)
    dates_str = [dt.strftime("%Y-%m-%d") for dt in series.index]
    hist_list = [round(float(v), 2) for v in values]

    # Stationarity check on raw series and d-th differenced series
    raw_adf = _adf_summary(values, "level_series")
    diff_adf = None
    if d > 0:
        diff_vals = np.diff(values, n=d)
        diff_adf = _adf_summary(diff_vals, f"diff_{d}_series")

    # Separate train/test evaluation (hold out last 6 months; do not leak into final fit)
    holdout_size = min(6, max(1, len(values) // 4))
    train_vals = values[:-holdout_size]
    test_vals = values[-holdout_size:]
    test_dates = dates_str[-holdout_size:]

    val_fitted = ARIMA(train_vals, order=(p, d, q)).fit()
    val_pred = np.asarray(val_fitted.forecast(steps=holdout_size), dtype=float)
    mae = float(np.mean(np.abs(test_vals - val_pred)))
    rmse = float(np.sqrt(np.mean((test_vals - val_pred) ** 2)))
    mape = float(
        np.mean(np.abs((test_vals - val_pred) / np.where(test_vals == 0, 1.0, test_vals))) * 100.0
    )

    # Final model fit on full historical series for out-of-sample future forecast
    fitted = ARIMA(values, order=(p, d, q)).fit()
    fitted_vals = np.asarray(fitted.fittedvalues, dtype=float)
    fitted_list = [
        round(float(v), 2) if np.isfinite(v) else None for v in fitted_vals
    ]

    forecast_vals = np.asarray(fitted.forecast(steps=horizon), dtype=float)
    forecast_list = [round(float(v), 2) for v in forecast_vals]

    future_dates = pd.date_range(
        series.index[-1] + pd.offsets.MonthBegin(1), periods=horizon, freq="MS"
    )
    forecast_dates = [dt.strftime("%Y-%m-%d") for dt in future_dates]

    order_justification = _build_order_justification(p, d, q, raw_adf, diff_adf, fitted)

    return {
        "task": "09_ARIMA",
        "dataset": {
            "source": "ml_projects/09_ARIMA/dataset/monthly_sales.csv",
            "path": source_path,
            "is_synthetic": True,
            "observations": int(len(values)),
            "start_date": dates_str[0],
            "end_date": dates_str[-1],
        },
        "order": [p, d, q],
        "steps": horizon,
        "dates": dates_str,
        "historical": hist_list,
        "fitted": fitted_list,
        "forecast_dates": forecast_dates,
        "forecast": forecast_list,
        "stationarity": {
            "raw_adf": raw_adf,
            "differenced_adf": diff_adf,
            "order_justification": order_justification,
        },
        "validation": {
            "method": "chronological_holdout",
            "train_observations": int(len(train_vals)),
            "test_observations": int(holdout_size),
            "test_dates": test_dates,
            "actual": [round(float(v), 2) for v in test_vals],
            "predicted": [round(float(v), 2) for v in val_pred],
        },
        "aic": round(float(fitted.aic), 4),
        "bic": round(float(fitted.bic), 4),
        "metrics": {
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "mape": round(mape, 4),
        },
    }