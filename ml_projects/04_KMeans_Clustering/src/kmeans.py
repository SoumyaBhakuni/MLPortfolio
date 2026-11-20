import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "clustering", "kmeans.joblib")


def load_or_create_customers() -> pd.DataFrame:
    os.makedirs(DATASET_DIR, exist_ok=True)
    csv_path = os.path.join(DATASET_DIR, "customers.csv")
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path).dropna()

    rng = np.random.default_rng(42)
    centers = [(25, 78), (30, 22), (55, 50), (85, 82), (82, 18)]
    rows = []
    for cx, cy in centers:
        for x_val, y_val in zip(rng.normal(cx, 7.0, 25), rng.normal(cy, 7.0, 25)):
            rows.append({
                "annual_income_k": round(float(np.clip(x_val, 10, 140)), 2),
                "spending_score": round(float(np.clip(y_val, 1, 100)), 2),
            })
    df = pd.DataFrame(rows)
    df.to_csv(csv_path, index=False)
    return df


def run_kmeans(n_clusters: int = 5) -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    df = load_or_create_customers()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df[["annual_income_k", "spending_score"]].values)

    ks = list(range(1, 9))
    inertias = []
    for k in ks:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_scaled)
        inertias.append(round(float(km.inertia_), 4))

    plt.figure(figsize=(7, 4))
    plt.plot(ks, inertias, marker="o", color="#F59E0B")
    plt.title("Elbow Method for Optimal K")
    plt.xlabel("Number of Clusters (K)")
    plt.ylabel("Inertia")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "elbow_curve.png"), dpi=150)
    plt.close()

    model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = model.fit_predict(X_scaled)
    df["cluster"] = labels
    joblib.dump({"model": model, "scaler": scaler}, MODEL_PATH)

    plt.figure(figsize=(8, 5))
    plt.scatter(df["annual_income_k"], df["spending_score"], c=df["cluster"], cmap="tab10", alpha=0.8)
    plt.title(f"Customer Segmentation (K={n_clusters})")
    plt.xlabel("Annual Income ($k)")
    plt.ylabel("Spending Score")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "clusters_scatter.png"), dpi=150)
    plt.close()

    summary = {
        "n_clusters": n_clusters,
        "inertia": round(float(model.inertia_), 4),
        "elbow": [{"k": k_val, "inertia": inert} for k_val, inert in zip(ks, inertias)],
        "cluster_counts": df["cluster"].value_counts().sort_index().to_dict(),
    }
    with open(os.path.join(STATS_DIR, "cluster_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary


if __name__ == "__main__":
    print("Task 04 K-Means:", run_kmeans(5))