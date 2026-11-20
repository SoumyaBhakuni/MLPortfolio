import os
from typing import Any
import numpy as np
import pandas as pd


def ensure_dir(path: str) -> str:
    """Create directory if it does not already exist."""
    os.makedirs(path, exist_ok=True)
    return path


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Replace infinite values with NaN so data is safe for modeling and JSON output."""
    cleaned = df.copy()
    num_cols = cleaned.select_dtypes(include=[np.number]).columns
    cleaned[num_cols] = cleaned[num_cols].replace([np.inf, -np.inf], np.nan)
    return cleaned


def require_json_dict(payload: Any) -> dict[str, Any]:
    """Validate that an incoming JSON request body is a non-empty dictionary."""
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a valid JSON object.")
    return payload