from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from database.db import get_db
from services.predictor import (
    ArtifactNotFoundError,
    predict_batch_from_dataframe,
    predict_records,
    predict_single_record,
)
from services.trainer import load_latest_uploaded_dataframe

router = APIRouter(tags=["prediction"])


@router.post("/predict")
async def predict(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.body()

        if not body:
            raise HTTPException(
                status_code=400,
                detail="Please provide a JSON object."
            )

        payload = await request.json()

        if isinstance(payload, list):
            return {
                "predictions": predict_records(
                    payload,
                    persist=True,
                    db=db,
                )
            }

        if isinstance(payload, dict) and "records" in payload:
            return {
                "predictions": predict_records(
                    payload["records"],
                    persist=True,
                    db=db,
                )
            }

        return predict_single_record(
            payload,
            persist=True,
            db=db,
        )

    except ArtifactNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/predict/batch")
def predict_batch(db: Session = Depends(get_db)):
    try:
        dataframe = load_latest_uploaded_dataframe()
        return predict_batch_from_dataframe(dataframe, db=db)

    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))