import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
GRAPHS_DIR = os.path.join(BASE_DIR, "outputs", "graphs")
STATS_DIR = os.path.join(BASE_DIR, "outputs", "statistics")


def load_or_create_iris() -> pd.DataFrame:
    os.makedirs(DATASET_DIR, exist_ok=True)
    csv_path = os.path.join(DATASET_DIR, "iris.csv")
    if os.path.exists(csv_path):
        return pd.read_csv(csv_path)

    iris = load_iris()
    df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
    df["species"] = [str(iris.target_names[i]) for i in iris.target]
    df.to_csv(csv_path, index=False)
    return df


def run_eda() -> dict:
    os.makedirs(GRAPHS_DIR, exist_ok=True)
    os.makedirs(STATS_DIR, exist_ok=True)

    df = load_or_create_iris()
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    summary_stats = pd.DataFrame({
        "count": df[num_cols].count(),
        "mean": df[num_cols].mean(),
        "median": df[num_cols].median(),
        "std": df[num_cols].std(),
        "variance": df[num_cols].var(),
        "min": df[num_cols].min(),
        "q25": df[num_cols].quantile(0.25),
        "q50": df[num_cols].quantile(0.50),
        "q75": df[num_cols].quantile(0.75),
        "max": df[num_cols].max(),
    }).round(4)

    summary_stats.to_csv(os.path.join(STATS_DIR, "summary_statistics.csv"))

    # 1. Histograms
    fig, axes = plt.subplots(2, 2, figsize=(10, 7))
    for ax, col in zip(axes.flat, num_cols):
        ax.hist(df[col], bins=15, color="#22D3EE", edgecolor="#0A0A0C")
        ax.set_title(f"Histogram: {col}")
        ax.set_xlabel(col)
        ax.set_ylabel("Frequency")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "histograms.png"), dpi=150)
    plt.close()

    # 2. Box plots
    fig, axes = plt.subplots(2, 2, figsize=(10, 7))
    for ax, col in zip(axes.flat, num_cols):
        sns.boxplot(data=df, x="species", y=col, ax=ax)
        ax.set_title(f"Box Plot: {col} by Species")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "boxplots.png"), dpi=150)
    plt.close()

    # 3. Scatter plot (Petal Length vs Petal Width)
    plt.figure(figsize=(8, 5))
    sns.scatterplot(data=df, x=num_cols[2], y=num_cols[3], hue="species")
    plt.title("Petal Length vs Petal Width by Species")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "scatter_petal.png"), dpi=150)
    plt.close()

    # 4. Species bar chart
    plt.figure(figsize=(6, 4))
    df["species"].value_counts().plot(kind="bar", color=["#22D3EE", "#10B981", "#F59E0B"])
    plt.title("Observations per Species")
    plt.xlabel("Species")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "species_bar.png"), dpi=150)
    plt.close()

    # 5. Pair plot
    pair_grid = sns.pairplot(df, hue="species", diag_kind="hist")
    pair_grid.savefig(os.path.join(GRAPHS_DIR, "pairplot.png"), dpi=120)
    plt.close("all")

    # 6. Correlation heatmap
    plt.figure(figsize=(7, 5))
    sns.heatmap(df[num_cols].corr(), annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Feature Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(os.path.join(GRAPHS_DIR, "correlation_heatmap.png"), dpi=150)
    plt.close()

    report = {
        "shape": [int(df.shape[0]), int(df.shape[1])],
        "missing_values": int(df.isnull().sum().sum()),
        "duplicates": int(df.duplicated().sum()),
        "species_counts": df["species"].value_counts().to_dict(),
    }
    with open(os.path.join(STATS_DIR, "eda_summary.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    return report


if __name__ == "__main__":
    out = run_eda()
    print("Task 01 EDA complete:", out)