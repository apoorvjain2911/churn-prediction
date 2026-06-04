from __future__ import annotations

from fastapi import APIRouter

from services.predictor import build_dashboard_summary

router = APIRouter(prefix="", tags=["dashboard"])


@router.get("/dashboard/summary")
def get_dashboard_summary():
    return build_dashboard_summary()