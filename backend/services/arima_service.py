from typing import Any
import numpy as np
from statsmodels.tsa.arima.model import ARIMA


def _series_data() -> list[float]:
    t = np.arange(1, 37, dtype=float)
    trend = 120.0 + 3.5 * t
    seasonal = 14.0 * np.sin(2 * np.pi * t / 12.0)
    return [round(float(v), 2) for v in (trend + seasonal)]


def forecast_arima(
    steps: Any = 6, order: Any = None
) -> dict[str, Any]:
    """Fit ARIMA(p, d, q) on monthly series and forecast future periods."""
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

    series = _series_data()
    model = ARIMA(series, order=(p, d, q))
    fitted = model.fit()
    forecast_vals = fitted.forecast(steps=horizon)

    train_hist = series[:-6]
    test_hist = series[-6:]
    val_model = ARIMA(train_hist, order=(p, d, q)).fit()
    val_pred = val_model.forecast(steps=len(test_hist))
    mae = float(np.mean(np.abs(np.array(test_hist) - np.array(val_pred))))
    rmse = float(np.sqrt(np.mean((np.array(test_hist) - np.array(val_pred)) ** 2)))

    return {
        "task": "09_ARIMA",
        "order": [p, d, q],
        "steps": horizon,
        "historical": series,
        "forecast": [round(float(v), 2) for v in forecast_vals],
        "aic": round(float(fitted.aic), 4),
        "metrics": {
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
        },
    }