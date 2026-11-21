# Task 02 — Simple Linear Regression (House Price Prediction)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `02_Linear_Regression` — Ordinary Least Squares (`LinearRegression`)
- **Dataset Provenance:** Synthetic demonstration data (`120` rows generated with `np.random.default_rng(42)` across `area_sqft` in `[500, 4000]` with `price_usd = 45000 + 115.0 * area_sqft + noise`, unless `dataset/housing.csv` is supplied)
- **API Endpoint:** `/api/task02/predict`

## Overview
Trains an Ordinary Least Squares (OLS) linear regression model mapping `area_sqft` to `price_usd`, evaluates regression error metrics (MSE, RMSE, MAE, and $R^2$), and serves interactive predictions through the backend and frontend.

## How to Run
```bash
python3 ml_projects/02_Linear_Regression/src/linear_regression.py