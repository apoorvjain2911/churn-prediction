# AI Customer Churn Prediction & Retention Dashboard

A full-stack machine learning application that predicts customer churn, identifies high-risk customers, and provides actionable retention insights through an interactive analytics dashboard.

### Live Demo

**Frontend:** https://churn-prediction-roan.vercel.app

---

## Overview

This project combines **React, FastAPI, and Machine Learning** to help businesses analyze customer churn risk. Users can upload customer datasets, train a churn prediction model, generate predictions, and visualize insights through an interactive dashboard.

A sample dataset is included, allowing users to explore the platform immediately without uploading their own data

---

## Features

* Customer churn prediction using Random Forest
* CSV dataset upload and validation
* Automated data preprocessing pipeline
* Customer risk segmentation (High, Medium, Low)
* AI-based retention recommendations
* Interactive analytics dashboard
* Prediction history tracking
* Feature importance visualization
* Production-ready deployment with Render and Vercel

---

## Tech Stack

**Frontend**

* React 19
* Vite
* Tailwind CSS
* Axios


**Backend**

* FastAPI
* Python
* Scikit-Learn
* Pandas
* SQLAlchemy
* Joblib

**Database**

* SQLite (Development)
* PostgreSQL Compatible (Production)

**Deployment**

* Vercel
* Render

---

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=sqlite:///./app.db
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

```

### Frontend

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/upload`            | Upload customer dataset            |
| POST   | `/train`             | Train churn prediction model       |
| POST   | `/predict`           | Predict churn for customer records |
| POST   | `/predict/batch`     | Generate dashboard predictions     |
| GET    | `/history`           | Retrieve prediction history        |
| GET    | `/dashboard/summary` | Dashboard analytics                |
| GET    | `/`                  | Health check                       |

---

## Future Improvements

* User Authentication
* SHAP Explainability
* Automated Model Retraining
* Model Version Tracking
* PDF/CSV Report Export
* Advanced Customer Segmentation

---


