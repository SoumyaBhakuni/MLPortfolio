# Task 07 — Principal Component Analysis (Iris Dataset)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `07_PCA` — `StandardScaler` + `PCA`
- **Dataset:** Iris Flower Dataset (150 observations, 4 standardized features projected to $k$ principal components)
- **API Endpoint:** `/api/task07/transform`

## Overview
Standardizes the 4 numerical Iris features with `StandardScaler` and applies Principal Component Analysis (`PCA`) to compute explained and cumulative variance ratios and project samples into lower-dimensional component space.

## How to Run
```bash
python3 ml_projects/07_PCA/src/pca.py