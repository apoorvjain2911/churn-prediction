# AI Customer Churn Prediction & Retention Dashboard

A production-ready full stack AI application for customer churn prediction, retention analytics, and prediction history tracking.

## Project Overview

This project combines a React 19 + Vite frontend with a FastAPI backend to deliver a polished SaaS-style churn dashboard. Users can upload customer CSV files, train a Random Forest churn model, generate risk predictions, inspect feature importance, and review stored prediction history.

The backend persists predictions in SQLite for development and is PostgreSQL-compatible for production deployments on Render.

## Features

- CSV upload with backend validation
- Automatic preprocessing for missing values, categorical encoding, and numeric cleaning
- RandomForestClassifier training with evaluation metrics
- Single-customer prediction endpoint with churn probability and risk labeling
- Batch dashboard prediction endpoint that stores prediction history
- AI retention recommendations by risk tier
- KPI cards, pie chart, contract churn chart, feature importance chart, and tenure distribution chart
- High risk customer table
- Prediction history page backed by SQLAlchemy and SQLite/PostgreSQL
- Deployment-ready configuration for Render and Vercel

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide Icons

### Backend
- Python 3.12
- FastAPI
- Uvicorn
- Pandas
- NumPy
- Scikit-Learn
- Joblib
- SQLAlchemy
- SQLite for development
- PostgreSQL-compatible configuration for production

### Deployment
- Frontend on Vercel
- Backend on Render

## Folder Structure

```text
backend/
  main.py
  api/
    upload.py
    train.py
    predict.py
    history.py
    dashboard.py
  services/
    preprocess.py
    trainer.py
    predictor.py
    recommendation.py
  database/
    db.py
    models.py
  artifacts/
    model.pkl
    pipeline.pkl
  uploads/
  requirements.txt
  render.yaml
  Procfile
  runtime.txt
  .env.example

frontend/
  index.html
  package.json
  vite.config.js
  tailwind.config.js
  postcss.config.js
  vercel.json
  src/
    App.jsx
    main.jsx
    index.css
    components/
      Navbar.jsx
      UploadCard.jsx
      KPICards.jsx
      Charts.jsx
      PredictionTable.jsx
      Footer.jsx
    pages/
      Dashboard.jsx
      History.jsx
    services/
      api.js
```

## Installation

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn

### Clone and install backend dependencies

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Install frontend dependencies

```bash
cd frontend
npm install
```

## Backend Setup

1. Copy `backend/.env.example` to `.env`.
2. Set `DATABASE_URL` and `FRONTEND_URL`.
3. Start the backend:

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

## Frontend Setup

1. Copy `frontend/.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to your backend URL.
3. Start the frontend:

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

### Backend
- `DATABASE_URL` - SQLite or PostgreSQL connection string
- `FRONTEND_URL` - Frontend origin for CORS
- `CORS_ORIGINS` - Optional comma-separated additional origins

### Frontend
- `VITE_API_BASE_URL` - FastAPI base URL

## API Documentation

### GET `/`

Returns the API health message.

### POST `/upload`

Upload a CSV file containing `customerID` and `Churn` columns.

### POST `/train`

Trains the Random Forest model on the latest uploaded dataset and returns metrics.

### POST `/predict`

Predicts churn for a single customer record or a list of records.

### POST `/predict/batch`

Runs predictions for the latest uploaded dataset, stores each prediction in the database, and returns dashboard analytics.

### GET `/history`

Returns stored prediction history.

### GET `/dashboard/summary`

Returns analytics derived from the latest uploaded dataset.

## Deployment on Render

1. Push the repository to GitHub.
2. Create a new Render Web Service from the backend folder.
3. Use the settings from `backend/render.yaml`.
4. Set environment variables:
   - `DATABASE_URL`
   - `FRONTEND_URL`
   - `CORS_ORIGINS`
5. Deploy with the start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Deployment on Vercel

1. Create a new Vercel project from the frontend folder.
2. Set `VITE_API_BASE_URL` to the Render backend URL.
3. Deploy using the included `frontend/vercel.json` rewrite so React Router works on refresh.

## Future Improvements

- Add scheduled retraining jobs
- Store model versions and training metadata
- Add authenticated user sessions and role-based access
- Support uploaded sample templates and dataset profiling
- Add SHAP-based explainability for individual customer predictions
- Add export to CSV and PDF for risk reports
