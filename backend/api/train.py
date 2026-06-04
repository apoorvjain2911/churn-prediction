from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from services.preprocess import LATEST_UPLOAD_PATH
from services.trainer import train_model_from_csv

router = APIRouter(prefix="", tags=["training"])


@router.post("/train")
def train_model():
    if not LATEST_UPLOAD_PATH.exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a CSV dataset before training the model.",
        )

    try:
        result = train_model_from_csv(LATEST_UPLOAD_PATH)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return result.to_dict()
