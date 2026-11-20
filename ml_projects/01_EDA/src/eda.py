# Task 1: Exploratory Data Analysis
# Dataset: Iris Flower Dataset

import argparse
import os
from typing import Any
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

SPECIES_PALETTE = {
    "setosa": "#22D3EE",
    "versicolor": "#10B981",
    "virginica": "#F59E0B",
}


def load_iris_dataframe() -> pd.DataFrame:
    """Load the Iris dataset from scikit-learn into a clean Pandas DataFrame."""
    iris = load_iris()
    df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
    df["species"] = [iris.target_names[i] for i in iris.target]
    return df


def compute_summary_statistics(df: pd.DataFrame) -> pd.DataFrame:
    """Compute count, mean, median, std, variance, min, quartiles, and max."""
    numeric_df = df.select_dtypes(include=np.number)
    return pd.DataFrame({
        "count": numeric_df.count(),
        "mean": numeric_df.mean(),
        "median": numeric_df.median(),
        "std": numeric_df.std(),
        "variance": numeric_df.var(),
        "min": numeric_df.min(),
        "q25": numeric_df.quantile(0.25),
        "q50": numeric_df.quantile(0.50),
        "q75": numeric_df.quantile(0.75),
        "max": numeric_df.max(),
    })


def generate_visualizations(df: pd.DataFrame, show_plots: bool = False) -> None:
    """Generate and save all six EDA visualizations to outputs/."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sns.set_theme(style="whitegrid")
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()

    # 1. Species distribution count plot
    plt.figure(figsize=(8, 5))
    sns.countplot(data=df, x="species", hue="species", palette=SPECIES_PALETTE, legend=False)
    plt.title("Distribution of Iris Flower Species")
    plt.xlabel("Species")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "species_distribution.png"), dpi=300)
    if show_plots:
        plt.show()
    plt.close()

    # 2. Histograms
    df[numeric_cols].hist(figsize=(12, 8), bins=15, color="#22D3EE", edgecolor="#0A0A0C")
    plt.suptitle("Distribution of Iris Dataset Features")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "feature_histograms.png"), dpi=300)
    if show_plots:
        plt.show()
    plt.close()

    # 3. Scatter plot: Sepal Length vs Petal Length
    plt.figure(figsize=(8, 5))
    sns.scatterplot(
        data=df,
        x="sepal length (cm)",
        y="petal length (cm)",
        hue="species",
        palette=SPECIES_PALETTE,
        s=80,
    )
    plt.title("Sepal Length vs Petal Length")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "sepal_vs_petal.png"), dpi=300)
    if show_plots:
        plt.show()
    plt.close()

    # 4. Correlation heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(df[numeric_cols].corr(), annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "correlation_heatmap.png"), dpi=300)
    if show_plots:
        plt.show()
    plt.close()

    # 5. Box plots
    plt.figure(figsize=(12, 6))
    sns.boxplot(data=df[numeric_cols], palette=["#22D3EE", "#10B981", "#F59E0B", "#A855F7"])
    plt.title("Box Plot of Iris Dataset Features")
    plt.xticks(rotation=20)
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "feature_boxplots.png"), dpi=300)
    if show_plots:
        plt.show()
    plt.close()

    # 6. Pair plot
    pair_plot = sns.pairplot(df, hue="species", palette=SPECIES_PALETTE)
    pair_plot.figure.suptitle("Pairwise Relationships in Iris Dataset", y=1.02)
    pair_plot.savefig(os.path.join(OUTPUT_DIR, "pairplot.png"), dpi=300)
    if show_plots:
        plt.show()
    plt.close("all")


def get_eda_payload() -> dict[str, Any]:
    """Return structured EDA metrics, statistics, correlations, rows, and findings for API/UI."""
    df = load_iris_dataframe()
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    stats_df = compute_summary_statistics(df).round(4)
    corr_df = df[numeric_cols].corr().round(4)
    species_counts = df["species"].value_counts().to_dict()

    records = []
    for idx, row in df.iterrows():
        records.append({
            "id": int(idx + 1),
            "sepal_length": float(row["sepal length (cm)"]),
            "sepal_width": float(row["sepal width (cm)"]),
            "petal_length": float(row["petal length (cm)"]),
            "petal_width": float(row["petal width (cm)"]),
            "species": str(row["species"]),
        })

    statistics_list = []
    for feature, row in stats_df.iterrows():
        statistics_list.append({
            "feature": feature,
            "count": int(row["count"]),
            "mean": float(row["mean"]),
            "median": float(row["median"]),
            "std": float(row["std"]),
            "variance": float(row["variance"]),
            "min": float(row["min"]),
            "q25": float(row["q25"]),
            "q50": float(row["q50"]),
            "q75": float(row["q75"]),
            "max": float(row["max"]),
        })

    return {
        "task": "TASK_01",
        "title": "Exploratory Data Analysis",
        "dataset": "Iris Flower Dataset",
        "overview": {
            "total_samples": int(df.shape[0]),
            "total_columns": int(df.shape[1]),
            "numerical_features": len(numeric_cols),
            "class_categories": int(df["species"].nunique()),
            "missing_values": int(df.isnull().sum().sum()),
            "duplicate_rows": int(df.duplicated().sum()),
            "species_distribution": species_counts,
            "feature_names": numeric_cols,
        },
        "statistics": statistics_list,
        "correlation": {
            "columns": numeric_cols,
            "matrix": corr_df.values.tolist(),
        },
        "records": records,
        "findings": [
            "Balanced class distribution across all three species: Setosa (50), Versicolor (50), and Virginica (50).",
            "Zero missing values and only 1 duplicate row across all 150 records (indices 101 and 142 in raw data).",
            "Petal length and petal width show strong positive correlation (r = 0.96) and cleanly separate Setosa from Versicolor and Virginica.",
            "Virginica has the largest mean petal length (5.55 cm) and petal width (2.03 cm), while Setosa has the smallest petals and widest sepals.",
            "Sepal width exhibits mild upper/lower outliers (notably in Setosa) compared to petal measurements.",
        ],
    }


def run_eda(show_plots: bool = False) -> pd.DataFrame:
    """Execute full EDA pipeline, print diagnostics, and save CSV + PNG outputs."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    df = load_iris_dataframe()
    numeric_df = df.select_dtypes(include=np.number)
    stats_df = compute_summary_statistics(df)

    print("\n========== DATASET LOADED ==========")
    print("Dataset loaded successfully!")

    print("\n========== FIRST FIVE ROWS ==========")
    print(df.head())

    print("\n========== DATASET INFORMATION ==========")
    df.info()

    print("\nDataset Shape:", df.shape)
    print("\nColumn Names:", df.columns.tolist())

    print("\n========== SUMMARY STATISTICS ==========")
    print(df.describe())

    print("\n========== MEAN ==========")
    print(numeric_df.mean())

    print("\n========== MEDIAN ==========")
    print(numeric_df.median())

    print("\n========== STANDARD DEVIATION ==========")
    print(numeric_df.std())

    print("\n========== MISSING VALUES ==========")
    print(df.isnull().sum())

    print("\n========== DUPLICATE RECORDS ==========")
    print("Number of duplicates:", df.duplicated().sum())

    print("\n========== SPECIES DISTRIBUTION ==========")
    print(df["species"].value_counts())

    stats_df.to_csv(os.path.join(OUTPUT_DIR, "summary_statistics.csv"))
    df.to_csv(os.path.join(OUTPUT_DIR, "iris_dataset.csv"), index=False)
    generate_visualizations(df, show_plots=show_plots)

    print("\n========== TASK COMPLETED ==========")
    print("EDA completed successfully!")
    print(f"All outputs saved in: {OUTPUT_DIR}")
    return df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Task 1: Iris Dataset EDA")
    parser.add_argument("--show", action="store_true", help="Display Matplotlib windows")
    args = parser.parse_args()
    run_eda(show_plots=args.show)