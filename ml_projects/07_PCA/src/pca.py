import os
import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")


def run_pca(n_components: int = 2) -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)

    iris = load_iris()
    X_scaled = StandardScaler().fit_transform(iris.data)

    pca_full = PCA(random_state=42).fit(X_scaled)
    cum_all = np.cumsum(pca_full.explained_variance_ratio_)

    plt.figure(figsize=(7, 4))
    plt.plot(range(1, len(cum_all) + 1), cum_all, marker="o", color="#22D3EE")
    plt.title("Cumulative Explained Variance Ratio (Iris)")
    plt.xlabel("Number of Components")
    plt.ylabel("Cumulative Variance")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "explained_variance.png"), dpi=150)
    plt.close()

    pca = PCA(n_components=n_components, random_state=42)
    X_proj = pca.fit_transform(X_scaled)

    if n_components >= 2:
        plt.figure(figsize=(8, 5))
        plt.scatter(X_proj[:, 0], X_proj[:, 1], c=iris.target, cmap="viridis", alpha=0.85)
        plt.title("PCA 2D Projection (PC1 vs PC2)")
        plt.xlabel("PC1")
        plt.ylabel("PC2")
        plt.tight_layout()
        plt.savefig(os.path.join(GRAPHS_DIR, "pca_projection_2d.png"), dpi=150)
        plt.close()

    summary = {
        "n_components": n_components,
        "explained_variance_ratio": [round(float(v), 6) for v in pca.explained_variance_ratio_],
        "cumulative_explained_variance": [round(float(v), 6) for v in np.cumsum(pca.explained_variance_ratio_)],
    }
    with open(os.path.join(STATS_DIR, "pca_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary


if __name__ == "__main__":
    print("Task 07 PCA:", run_pca(2))