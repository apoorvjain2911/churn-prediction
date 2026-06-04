from __future__ import annotations

from typing import Any

import joblib
import numpy as np
import pandas as pd
from sqlalchemy.orm import Session

from database.models import Prediction

from services.preprocess import (
    ID_COLUMN,
    LATEST_UPLOAD_PATH,
    MODEL_PATH,
    PIPELINE_PATH,
    coerce_input_frame,
    read_csv,
)

from services.recommendation import (
    get_recommendation,
    get_risk_level,
)


class ArtifactNotFoundError(RuntimeError):
    pass


def load_artifacts() -> tuple[Any, Any]:
    if not MODEL_PATH.exists() or not PIPELINE_PATH.exists():
        raise ArtifactNotFoundError(
            "Train a model before requesting predictions."
        )

    model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PIPELINE_PATH)

    return model, preprocessor


def extract_customer_id(
    row: dict[str, Any],
    fallback_index: int = 0,
) -> str:
    for key in (
        "customer_id",
        "customerID",
        "customerId",
        "id",
    ):
        value = row.get(key)
        if value not in (None, ""):
            return str(value)

    return f"customer-{fallback_index + 1}"


def predict_dataframe(
    frame: pd.DataFrame,
    persist: bool = False,
    db: Session | None = None,
) -> list[dict]:
    model, preprocessor = load_artifacts()

    expected_columns = list(
        getattr(
            preprocessor,
            "feature_names_in_",
            frame.columns.tolist(),
        )
    )

    prepared = coerce_input_frame(
        frame,
        expected_columns,
    )

    transformed = preprocessor.transform(prepared)
    probabilities = model.predict_proba(
        transformed
    )[:, 1]

    results: list[dict] = []

    for index, probability in enumerate(probabilities):
        risk = get_risk_level(float(probability))
        recommendation = get_recommendation(risk)

        customer_id = str(
            frame.iloc[index].get(
                ID_COLUMN,
                frame.iloc[index].get(
                    "customer_id",
                    f"customer-{index + 1}",
                ),
            )
        )

        item = {
            "customer_id": customer_id,
            "probability": round(
                float(probability),
                4,
            ),
            "risk": risk,
            "recommendation": recommendation,
        }

        results.append(item)

        if persist and db is not None:
            db.add(
                Prediction(
                    customer_id=customer_id,
                    probability=float(probability),
                    risk=risk,
                    recommendation=recommendation,
                )
            )

    if persist and db is not None:
        db.commit()

    return results


def predict_records(
    records: list[dict],
    persist: bool = True,
    db: Session | None = None,
) -> list[dict]:
    frame = pd.DataFrame(records)

    return predict_dataframe(
        frame,
        persist=persist,
        db=db,
    )


def predict_single_record(
    record: dict,
    persist: bool = True,
    db: Session | None = None,
) -> dict:
    return predict_records(
        [record],
        persist=persist,
        db=db,
    )[0]


def predict_latest_dataset() -> list[dict]:
    if not LATEST_UPLOAD_PATH.exists():
        return []

    dataset = read_csv(LATEST_UPLOAD_PATH)

    if ID_COLUMN not in dataset.columns:
        dataset[ID_COLUMN] = [
            f"customer-{i + 1}"
            for i in range(len(dataset))
        ]

    return predict_dataframe(
        dataset,
        persist=False,
    )


def predict_batch_from_dataframe(
    dataframe: pd.DataFrame,
    db: Session | None = None,
) -> dict:
    predictions = predict_dataframe(
        dataframe,
        persist=True,
        db=db,
    )

    total_customers = len(predictions)

    predicted_churn = len(
        [
            item
            for item in predictions
            if item["probability"] >= 0.5
        ]
    )

    churn_rate = (
        round(
            predicted_churn / total_customers,
            4,
        )
        if total_customers
        else 0
    )

    average_monthly_charges = 0

    if "MonthlyCharges" in dataframe.columns:
        average_monthly_charges = round(
            float(
                pd.to_numeric(
                    dataframe["MonthlyCharges"],
                    errors="coerce",
                )
                .fillna(0)
                .mean()
            ),
            2,
        )

    high_risk_customers = [
        item
        for item in predictions
        if item["risk"] == "High"
    ][:10]

    return {
        "total_customers": total_customers,
        "predicted_churn": predicted_churn,
        "churn_rate": churn_rate,
        "average_monthly_charges": average_monthly_charges,
        "pie_data": [
            {
                "name": "Churn",
                "value": predicted_churn,
            },
            {
                "name": "Retained",
                "value": total_customers
                - predicted_churn,
            },
        ],
        "contract_churn_data": [],
        "feature_importance": [],
        "tenure_distribution": [],
        "high_risk_customers": high_risk_customers,
        "predictions": predictions,
    }


def build_dashboard_summary() -> dict:
    if not LATEST_UPLOAD_PATH.exists():
        return {
            "total_customers": 0,
            "predicted_churn": 0,
            "churn_rate": 0,
            "average_monthly_charges": 0,
            "pie_data": [
                {
                    "name": "Churn",
                    "value": 0,
                },
                {
                    "name": "Retained",
                    "value": 0,
                },
            ],
            "contract_churn_data": [],
            "feature_importance": [],
            "tenure_distribution": [],
            "high_risk_customers": [],
            "message": "Upload a CSV file to begin.",
        }

    dataset = read_csv(
        LATEST_UPLOAD_PATH
    )

    if ID_COLUMN not in dataset.columns:
        dataset[ID_COLUMN] = [
            f"customer-{i + 1}"
            for i in range(len(dataset))
        ]

    return predict_batch_from_dataframe(
        dataset,
        db=None,
    )