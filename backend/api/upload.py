from __future__ import annotations

from pathlib import Path

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from services.preprocess import LATEST_UPLOAD_PATH, ensure_storage_directories, read_csv

router = APIRouter(prefix="", tags=["upload"])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only CSV files are supported.")

    ensure_storage_directories()
    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty.")

    temp_path = LATEST_UPLOAD_PATH
    temp_path.write_bytes(content)

    try:
        frame = read_csv(temp_path)
    except Exception as exc:
        temp_path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    required_columns = {"customerID", "Churn"}
    missing = sorted(required_columns - set(frame.columns))
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required columns: {', '.join(missing)}",
        )

    return {"rows": int(len(frame)), "status": "success"}
