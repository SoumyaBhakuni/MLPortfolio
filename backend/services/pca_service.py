from typing import Any
import numpy as np
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler


def transform_pca(n_components: Any = 2) -> dict[str, Any]:
    """Standardize Iris features and compute PCA projections and variance ratios."""
    try:
        n_comp = int(n_components)
    except (TypeError, ValueError) as exc:
        raise ValueError("'n_components' must be an integer.") from exc

    if n_comp < 1 or n_comp > 4:
        raise ValueError("'n_components' must be between 1 and 4.")

    iris = load_iris()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(iris.data)

    pca = PCA(n_components=n_comp, random_state=42)
    X_proj = pca.fit_transform(X_scaled)

    explained = [round(float(v), 6) for v in pca.explained_variance_ratio_]
    cumulative = [round(float(v), 6) for v in np.cumsum(pca.explained_variance_ratio_)]

    projected_rows = []
    for idx, row in enumerate(X_proj):
        entry = {
            "id": idx + 1,
            "species": str(iris.target_names[iris.target[idx]]),
        }
        for c_idx in range(n_comp):
            entry[f"PC{c_idx + 1}"] = round(float(row[c_idx]), 4)
        projected_rows.append(entry)

    return {
        "task": "07_PCA",
        "n_components": n_comp,
        "original_dimensions": int(iris.data.shape[1]),
        "reduced_dimensions": n_comp,
        "explained_variance_ratio": explained,
        "cumulative_explained_variance": cumulative,
        "total_retained_variance": round(float(cumulative[-1]), 6),
        "components": projected_rows,
    }