from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

from services.preprocess import (
    ARTIFACTS_DIR,
    LATEST_UPLOAD_PATH,
    MODEL_PATH,
    PIPELINE_PATH,
    build_preprocessor,
    ensure_storage_directories,
    read_csv,
    split_features_target,
)


@dataclass
class TrainingResult:
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    feature_importance: list[dict]

    def to_dict(self) -> dict:
        return {
            "accuracy": round(float(self.accuracy), 4),
            "precision": round(float(self.precision), 4),
            "recall": round(float(self.recall), 4),
            "f1": round(float(self.f1), 4),
            "roc_auc": round(float(self.roc_auc), 4),
            "feature_importance": self.feature_importance,
        }


def train_model_from_csv(file_path: str | Path) -> TrainingResult:
    dataset = read_csv(file_path)
    return train_model_from_frame(dataset)


def train_model_from_frame(
    dataset: pd.DataFrame,
) -> TrainingResult:
    ensure_storage_directories()

    features, target = split_features_target(
        dataset
    )

    if target.nunique() < 2:
        raise ValueError(
            "Target column must contain at least two classes."
        )

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.2,
        random_state=42,
        stratify=target,
    )

    preprocessor = build_preprocessor(
        x_train
    )

    x_train_processed = preprocessor.fit_transform(
        x_train
    )

    x_test_processed = preprocessor.transform(
        x_test
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )

    model.fit(
        x_train_processed,
        y_train,
    )

    predictions = model.predict(
        x_test_processed
    )

    probabilities = model.predict_proba(
        x_test_processed
    )[:, 1]

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    precision = precision_score(
        y_test,
        predictions,
        zero_division=0,
    )

    recall = recall_score(
        y_test,
        predictions,
        zero_division=0,
    )

    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0,
    )

    roc_auc = roc_auc_score(
        y_test,
        probabilities,
    )

    joblib.dump(
        model,
        MODEL_PATH,
    )

    joblib.dump(
        preprocessor,
        PIPELINE_PATH,
    )

    feature_names = (
        preprocessor.get_feature_names_out()
    )

    feature_importance = sorted(
        [
            {
                "feature": str(name),
                "importance": round(
                    float(value),
                    6,
                ),
            }
            for name, value in zip(
                feature_names,
                model.feature_importances_,
            )
        ],
        key=lambda x: x["importance"],
        reverse=True,
    )[:10]

    return TrainingResult(
        accuracy=accuracy,
        precision=precision,
        recall=recall,
        f1=f1,
        roc_auc=roc_auc,
        feature_importance=feature_importance,
    )


def load_latest_uploaded_dataframe() -> pd.DataFrame:
    ensure_storage_directories()

    if not LATEST_UPLOAD_PATH.exists():
        raise FileNotFoundError(
            "No uploaded dataset found. Upload a CSV first."
        )

    return read_csv(
        LATEST_UPLOAD_PATH
    )