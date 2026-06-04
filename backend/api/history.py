from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from database.models import Prediction

router = APIRouter(prefix="", tags=["history"])


@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    records = db.query(Prediction).order_by(Prediction.created_at.desc(), Prediction.id.desc()).all()
    return [record.to_dict() for record in records]
