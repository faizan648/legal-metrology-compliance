# 🚀 Legal Metrology Compliance Engine — Production Deployment Guide

## Monorepo Architecture

```text
legal-metrology-compliance/
├── frontend/             <-- React + Vite UI (Vercel)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/              <-- Python FastAPI API Server (Render)
│   ├── server.py
│   ├── compliance.py
│   ├── db.py
│   ├── requirements.txt
│   └── .env
├── vercel.json
├── render.yaml
└── DEPLOY.md
```

---

## Step 1: Deploy Backend on Render

1. Go to **[dashboard.render.com](https://dashboard.render.com/)** → **New +** → **Web Service**
2. Connect your GitHub repository: `faizan648/legal-metrology-compliance`
3. Configure settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `lm-compliance-api` |
| **Root Directory** | `backend` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Plan** | `Free` |

4. Environment Variables:

| Key | Value |
| :--- | :--- |
| `MONGO_URL` | `mongodb+srv://faizanhussainkhan909:MongoDbAtlas123@cluster0.jqk70.mongodb.net/legal_metrology?retryWrites=true&w=majority` |
| `DB_NAME` | `legal_metrology` |
| `JWT_SECRET` | `lm-compliance-2026-prod-secret-xyz` |
| `ADMIN_EMAIL` | `admin@lm.gov.in` |
| `ADMIN_PASSWORD` | `admin123` |
| `OFFICER_EMAIL` | `officer@lm.gov.in` |
| `OFFICER_PASSWORD` | `officer123` |
| `CORS_ORIGINS` | `https://lm-compliance.vercel.app` |

5. Click **Create Web Service**

---

## Step 2: Deploy Frontend on Vercel

1. Go to **[vercel.com](https://vercel.com/)** → **Add New...** → **Project**
2. Import repository: `faizan648/legal-metrology-compliance`
3. Configure settings:

| Setting | Value |
| :--- | :--- |
| **Root Directory** | `frontend` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. Environment Variable:

| Key | Value |
| :--- | :--- |
| `VITE_BACKEND_URL` | `https://lm-compliance-api.onrender.com` *(Your Render backend URL)* |

5. Click **Deploy**

---

## Step 3: Run Locally

- **Start Backend**: `cd backend && .\venv\Scripts\python.exe -m uvicorn server:app --host 127.0.0.1 --port 8000`
- **Start Frontend**: `cd frontend && npm run dev`
