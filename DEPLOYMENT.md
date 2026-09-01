# 🌐 ProsperHigh — Online Cloud Deployment Guide

This guide details how to deploy **ProsperHigh v3** online for public access using free tier cloud platforms (**Vercel** for Next.js frontend + **Render** for FastAPI backend).

---

## 🏗️ Deployment Architecture

```text
                                PUBLIC USERS
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
         Vercel (Frontend UI)               Render (Backend API)
     https://prosperhigh.vercel.app      https://prosperhigh-api.onrender.com
                    │                                 │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                          SQLite / PostgreSQL DB
```

---

## STEP 1: Deploy FastAPI Backend to Render (Free)

1. Sign up/log in at [Render.com](https://render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository: `https://github.com/RohithKumar-2007/ProsperHigh`.
4. Configure the Web Service parameters:
   - **Name**: `prosperhigh-api`
   - **Region**: Oregon (US) or Singapore
   - **Branch**: `main`
   - **Root Directory**: `.` (leave default)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install fastapi uvicorn pydantic gunicorn`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Once deployed, copy your live API URL (e.g., `https://prosperhigh-api.onrender.com`).

---

## STEP 2: Deploy Next.js Frontend to Vercel (Free)

1. Sign up/log in at [Vercel.com](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `https://github.com/RohithKumar-2007/ProsperHigh`.
4. Configure Project Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Select `frontend` (Click **Edit** next to Root Directory and select `frontend`).
5. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your live Render API URL from Step 1 (e.g. `https://prosperhigh-api.onrender.com`)
6. Click **Deploy**.
7. Vercel will build and launch your website (e.g. `https://prosperhigh.vercel.app`).

---

## STEP 3: Verify Online Deployment

1. Visit your Vercel URL (e.g. `https://prosperhigh.vercel.app`).
2. Test the 10-Step Investor Onboarding flow.
3. Test stock search & multi-agent analysis on any symbol (e.g. `TATAMOTORS`, `RELIANCE`, `INFY`).
4. Test the interactive Guided Tour overlay.

---

## 🔒 Post-Deployment Check

- Ensure `NEXT_PUBLIC_API_URL` in Vercel points to your live HTTPS Render backend.
- Ensure CORS in `backend/main.py` permits requests from your Vercel domain (`allow_origins=["*"]`).
