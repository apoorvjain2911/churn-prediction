from __future__ import annotations

from pathlib import Path
from typing import Iterable

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
UPLOADS_DIR = PROJECT_ROOT / "uploads"
MODEL_PATH = ARTIFACTS_DIR / "model.pkl"
PIPELINE_PATH = ARTIFACTS_DIR / "pipeline.pkl"
LATEST_UPLOAD_PATH = UPLOADS_DIR / "latest_upload.csv"
TARGET_COLUMN = "Churn"
ID_COLUMN = "customerID"


def ensure_storage_directories() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


def read_csv(file_path: str | Path) -> pd.DataFrame:
    frame = pd.read_csv(file_path)
    if frame.empty:
        raise ValueError("The uploaded dataset is empty.")
    return frame


def normalize_total_charges(frame: pd.DataFrame) -> pd.DataFrame:
    if "TotalCharges" in frame.columns:
        frame = frame.copy()
        frame["TotalCharges"] = pd.to_numeric(frame["TotalCharges"], errors="coerce")
    return frame


def normalize_target(series: pd.Series) -> pd.Series:
    if pd.api.types.is_numeric_dtype(series):
        return series.fillna(0).astype(int)

    normalized = series.astype(str).str.strip().str.lower()
    mapping = {
        "yes": 1,
        "true": 1,
        "1": 1,
        "churn": 1,
        "no": 0,
        "false": 0,
        "0": 0,
        "retain": 0,
        "retained": 0,
    }
    mapped = normalized.map(mapping)
    if mapped.isna().any():
        missing_values = sorted(set(normalized[mapped.isna()].tolist()))
        raise ValueError(f"Unsupported target labels found in {TARGET_COLUMN}: {missing_values}")
    return mapped.astype(int)


def split_features_target(frame: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    if TARGET_COLUMN not in frame.columns:
        raise ValueError(f"Missing required target column: {TARGET_COLUMN}")

    cleaned = normalize_total_charges(frame.copy())
    target = normalize_target(cleaned[TARGET_COLUMN])
    features = cleaned.drop(columns=[TARGET_COLUMN], errors="ignore")
    if ID_COLUMN in features.columns:
        features = features.drop(columns=[ID_COLUMN])
    if features.empty:
        raise ValueError("The dataset does not contain usable feature columns.")
    return features, target


def prepare_features(frame: pd.DataFrame) -> pd.DataFrame:
    cleaned = normalize_total_charges(frame.copy())
    if ID_COLUMN in cleaned.columns:
        cleaned = cleaned.drop(columns=[ID_COLUMN])
    if TARGET_COLUMN in cleaned.columns:
        cleaned = cleaned.drop(columns=[TARGET_COLUMN])
    return cleaned


def build_preprocessor(features: pd.DataFrame) -> ColumnTransformer:
    numerical_columns = features.select_dtypes(include=["number"]).columns.tolist()
    categorical_columns = [column for column in features.columns if column not in numerical_columns]

    transformers: list[tuple[str, Pipeline, Iterable[str]]] = []
    if numerical_columns:
        transformers.append(
            (
                "numeric",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                        ("scaler", StandardScaler()),
                    ]
                ),
                numerical_columns,
            )
        )
    if categorical_columns:
        transformers.append(
            (
                "categorical",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        (
                            "encoder",
                            OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                        ),
                    ]
                ),
                categorical_columns,
            )
        )
    if not transformers:
        raise ValueError("Unable to determine numeric or categorical feature columns.")

    return ColumnTransformer(transformers=transformers, remainder="drop")


def coerce_input_frame(frame: pd.DataFrame, expected_columns: list[str]) -> pd.DataFrame:
    prepared = normalize_total_charges(frame.copy())
    if ID_COLUMN in prepared.columns:
        prepared = prepared.drop(columns=[ID_COLUMN])
    if TARGET_COLUMN in prepared.columns:
        prepared = prepared.drop(columns=[TARGET_COLUMN])
    for column in expected_columns:
        if column not in prepared.columns:
            prepared[column] = pd.NA
    return prepared[expected_columns]
