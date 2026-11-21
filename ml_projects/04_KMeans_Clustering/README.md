# Task 04 — K-Means Clustering (Customer Segmentation)

- **Internship:** Happieloop Technologies (10 July – 9 August 2026)
- **Module:** `04_KMeans_Clustering` — K-Means with `StandardScaler` and Elbow evaluation
- **Dataset Provenance:** Synthetic demonstration data (`120` rows generated around 5 Gaussian centers with `np.random.default_rng(42)` for `annual_income_k` and `spending_score`, unless `dataset/customers.csv` is supplied)
- **API Endpoint:** `/api/task04/cluster`

## Overview
Standardizes customer segmentation features with `StandardScaler`, evaluates inertia across cluster counts for elbow analysis, fits `KMeans`, and exposes cluster assignments and centroids for interactive exploration.

## How to Run
```bash
python3 ml_projects/04_KMeans_Clustering/src/kmeans.py