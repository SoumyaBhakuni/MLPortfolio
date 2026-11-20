import os
from typing import Any
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from config import Config
from utils.preprocessing import ensure_dir


def _load_customer_df() -> pd.DataFrame:
    csv_path = os.path.join(
        Config.ML_PROJECTS_DIR, "04_KMeans_Clustering", "dataset", "customers.csv"
    )
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path).dropna()
        if {"annual_income_k", "spending_score"}.issubset(df.columns):
            return df[["annual_income_k", "spending_score"]]

    rng = np.random.default_rng(42)
    centers = [(25, 78), (30, 22), (55, 50), (85, 82), (82, 18)]
    rows = []
    for cx, cy in centers:
        pts_x = rng.normal(cx, 7.0, 24)
        pts_y = rng.normal(cy, 7.0, 24)
        for x_val, y_val in zip(pts_x, pts_y):
            rows.append({
                "annual_income_k": round(float(np.clip(x_val, 10, 140)), 2),
                "spending_score": round(float(np.clip(y_val, 1, 100)), 2),
            })
    return pd.DataFrame(rows)


def run_kmeans_clustering(n_clusters: Any = 5) -> dict[str, Any]:
    """Run standardized K-Means clustering, compute elbow inertias, and return cluster summary."""
    try:
        k = int(n_clusters)
    except (TypeError, ValueError) as exc:
        raise ValueError("'n_clusters' must be an integer.") from exc

    if k < 2 or k > 10:
        raise ValueError("'n_clusters' must be between 2 and 10.")

    df = _load_customer_df()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df[["annual_income_k", "spending_score"]].values)

    elbow = []
    for cand_k in range(1, 9):
        km_tmp = KMeans(n_clusters=cand_k, random_state=42, n_init=10)
        km_tmp.fit(X_scaled)
        elbow.append({"k": cand_k, "inertia": round(float(km_tmp.inertia_), 4)})

    model = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = model.fit_predict(X_scaled)
    df_clustered = df.copy()
    df_clustered["cluster"] = labels.astype(int)

    model_dir = ensure_dir(os.path.join(Config.MODELS_DIR, "clustering"))
    joblib.dump({"model": model, "scaler": scaler}, os.path.join(model_dir, "kmeans.joblib"))

    centroids_orig = scaler.inverse_transform(model.cluster_centers_)
    centroids = [
        {
            "cluster": idx,
            "annual_income_k": round(float(row[0]), 2),
            "spending_score": round(float(row[1]), 2),
            "count": int((labels == idx).sum()),
        }
        for idx, row in enumerate(centroids_orig)
    ]

    points = [
        {
            "annual_income_k": float(r["annual_income_k"]),
            "spending_score": float(r["spending_score"]),
            "cluster": int(r["cluster"]),
        }
        for _, r in df_clustered.iterrows()
    ]

    return {
        "task": "04_KMeans_Clustering",
        "n_clusters": k,
        "inertia": round(float(model.inertia_), 4),
        "elbow": elbow,
        "centroids": centroids,
        "points": points,
    }