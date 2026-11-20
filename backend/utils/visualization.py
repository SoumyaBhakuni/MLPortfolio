from typing import Any
import numpy as np
import pandas as pd

PORTFOLIO_PALETTE = [
    "#22D3EE",  # Cyan
    "#10B981",  # Emerald
    "#F59E0B",  # Solar Amber
    "#A855F7",  # Cyber Violet
    "#F43F5E",  # Coral Rose
]

SPECIES_PALETTE = {
    "setosa": "#22D3EE",
    "versicolor": "#10B981",
    "virginica": "#F59E0B",
}


def build_scatter_series(
    df: pd.DataFrame,
    x_col: str,
    y_col: str,
    group_col: str | None = None,
) -> dict[str, Any]:
    """Format grouped scatter points for frontend charts."""
    if group_col and group_col in df.columns:
        series = []
        for idx, (group_val, grp) in enumerate(df.groupby(group_col)):
            label = str(group_val)
            color = SPECIES_PALETTE.get(
                label.lower(), PORTFOLIO_PALETTE[idx % len(PORTFOLIO_PALETTE)]
            )
            series.append({
                "name": label,
                "color": color,
                "x": [round(float(v), 4) for v in grp[x_col].tolist()],
                "y": [round(float(v), 4) for v in grp[y_col].tolist()],
            })
        return {"x": x_col, "y": y_col, "series": series}

    return {
        "x": x_col,
        "y": y_col,
        "series": [
            {
                "name": "observations",
                "color": PORTFOLIO_PALETTE[0],
                "x": [round(float(v), 4) for v in df[x_col].tolist()],
                "y": [round(float(v), 4) for v in df[y_col].tolist()],
            }
        ],
    }


def build_correlation_matrix(df: pd.DataFrame) -> dict[str, Any]:
    """Compute rounded correlation matrix for numeric features."""
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr().fillna(0.0).round(4)
    return {
        "columns": corr.columns.tolist(),
        "matrix": corr.values.tolist(),
    }