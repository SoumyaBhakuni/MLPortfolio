import os
from typing import Any
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from config import Config
from utils.preprocessing import clean_dataframe, ensure_dir
from utils.visualization import build_correlation_matrix, build_scatter_series


def load_iris_df() -> pd.DataFrame:
    """Load Iris dataset from local CSV if present, otherwise from scikit-learn."""
    csv_path = os.path.join(Config.ML_PROJECTS_DIR, "01_EDA", "dataset", "iris.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
    else:
        iris = load_iris()
        df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
        df["species"] = [str(iris.target_names[i]) for i in iris.target]
    return clean_dataframe(df)


def get_eda_report(export_stats: bool = False) -> dict[str, Any]:
    """Compute complete Iris EDA statistics, records, correlations, and findings."""
    df = load_iris_df()
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    num_df = df[numeric_cols]

    stats_df = pd.DataFrame({
        "count": num_df.count(),
        "mean": num_df.mean(),
        "median": num_df.median(),
        "std": num_df.std(),
        "variance": num_df.var(),
        "min": num_df.min(),
        "q25": num_df.quantile(0.25),
        "q50": num_df.quantile(0.50),
        "q75": num_df.quantile(0.75),
        "max": num_df.max(),
    }).round(4)

    if export_stats:
        stats_dir = ensure_dir(
            os.path.join(Config.ML_PROJECTS_DIR, "01_EDA", "outputs", "statistics")
        )
        stats_df.to_csv(os.path.join(stats_dir, "summary_statistics.csv"))

    records = []
    for idx, row in df.iterrows():
        records.append({
            "id": int(idx) + 1,
            "sepal_length": float(row.get("sepal length (cm)", row.get("sepal_length", 0.0))),
            "sepal_width": float(row.get("sepal width (cm)", row.get("sepal_width", 0.0))),
            "petal_length": float(row.get("petal length (cm)", row.get("petal_length", 0.0))),
            "petal_width": float(row.get("petal width (cm)", row.get("petal_width", 0.0))),
            "species": str(row["species"]),
        })

    statistics = [
        {
            "feature": feat,
            "count": int(r["count"]),
            "mean": float(r["mean"]),
            "median": float(r["median"]),
            "std": float(r["std"]),
            "variance": float(r["variance"]),
            "min": float(r["min"]),
            "q25": float(r["q25"]),
            "q50": float(r["q50"]),
            "q75": float(r["q75"]),
            "max": float(r["max"]),
        }
        for feat, r in stats_df.iterrows()
    ]

    species_counts = {str(k): int(v) for k, v in df["species"].value_counts().items()}

    return {
        "task": "01_EDA",
        "title": "Exploratory Data Analysis",
        "dataset": "Iris Flower Dataset",
        "overview": {
            "total_rows": int(df.shape[0]),
            "total_columns": int(df.shape[1]),
            "numerical_features": len(numeric_cols),
            "species_count": int(df["species"].nunique()),
            "missing_values": int(df.isnull().sum().sum()),
            "duplicate_rows": int(df.duplicated().sum()),
            "species_distribution": species_counts,
            "columns": df.columns.tolist(),
            "numeric_columns": numeric_cols,
        },
        "first_five": records[:5],
        "last_five": records[-5:],
        "records": records,
        "statistics": statistics,
        "correlation": build_correlation_matrix(df),
        "findings": [
            "The dataset contains 150 observations across 3 balanced species (Setosa, Versicolor, Virginica—50 each).",
            "There are 4 numerical features and 1 categorical target column with 0 missing values.",
            "Petal length and petal width show strong positive correlation and separate Setosa clearly from Versicolor and Virginica.",
            "Virginica has the highest average petal length and petal width, while Setosa has wider sepals on average than Versicolor and Virginica.",
            "Box plots and quartiles highlight mild spread differences and potential outliers in sepal width.",
        ],
    }


def get_scatter_data(x_col: str, y_col: str) -> dict[str, Any]:
    """Return scatter series for any two valid columns in the Iris dataset."""
    df = load_iris_df()
    if x_col not in df.columns or y_col not in df.columns:
        raise ValueError(f"Invalid column selection: '{x_col}' or '{y_col}'.")
    return build_scatter_series(df, x_col=x_col, y_col=y_col, group_col="species")