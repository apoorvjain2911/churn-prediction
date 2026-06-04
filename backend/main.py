from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import init_db
from api.dashboard import router as dashboard_router
from api.history import router as history_router
from api.predict import router as predict_router
from api.train import router as train_router
from api.upload import router as upload_router

load_dotenv()


def _parse_cors_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS", "")

    origins = [
        origin.strip().rstrip("/")
        for origin in raw_origins.split(",")
        if origin.strip()
    ]

    frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")

    if frontend_url:
        origins.append(frontend_url)

    return sorted(set(origins))


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="AI Customer Churn Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(train_router)
app.include_router(predict_router)
app.include_router(history_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "Customer Churn Prediction API",
        "status": "running",
    }