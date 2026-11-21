# Task 09 — ARIMA Time-Series Forecasting

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `09_ARIMA` — `statsmodels.tsa.arima.model.ARIMA` with ADF stationarity check and chronological holdout validation
- **Dataset:** `dataset/monthly_sales.csv` (36 monthly observations with `date` and `sales` columns)
- **API Endpoint:** `/api/task09/forecast`

## Overview
Loads `dataset/monthly_sales.csv` as the single source of truth, runs Augmented Dickey-Fuller (ADF) stationarity checks, evaluates out-of-sample error (MAE, RMSE) on a chronological holdout split separate from the final forecast, fits `ARIMA(p, d, q)` on the full series, and returns historical, fitted, and forecast values alongside AIC/BIC.

## How to Run
```bash
python3 ml_projects/09_ARIMA/src/arima.py