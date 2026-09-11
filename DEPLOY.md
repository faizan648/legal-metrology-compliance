# Legal Metrology Compliance Engine — Deployment Guide

## Stack
- **Frontend**: React + Vite → Vercel
- **Backend**: FastAPI (Python) → Render
- **Database**: TinyDB (JSON file, built-in) or MongoDB Atlas (optional, free)

---

## Step 1: Push to GitHub

First, create a repository on GitHub (github.com → New Repository).

Then push your project:
```bash
cd "d:\Software System to check compliance of Packaged Commodities"
git init
git add .
git commit -m "Initial commit: Legal Metrology Compliance Engine"
git remote add origin https://github.com/YOUR_USERNAME/legal-metrology-compliance.git
git push -u origin main
```

> ⚠️ Create a `.gitignore` file first (see below) so you don't upload sensitive files or node_modules.

---

## Step 2: Deploy Backend on Render

### 2a. Sign up at [render.com](https://render.com)

### 2b. Create a New Web Service
1. Click **New → Web Service**
2. Connect your GitHub repository
3. Fill in these settings:

| Setting | Value |
|---|---|
| **Name** | `lm-compliance-backend` |
| **Root Directory** | `backend` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### 2c. Add Environment Variables (on Render dashboard)
Click **Environment → Add Environment Variable** for each:

| Key | Value |
|---|---|
| `JWT_SECRET` | (any long random string, e.g. `lm-compliance-2026-prod-secret-xyz`) |
| `ADMIN_EMAIL` | `admin@lm.gov.in` |
| `ADMIN_PASSWORD` | `admin123` (change this!) |
| `OFFICER_EMAIL` | `officer@lm.gov.in` |
| `OFFICER_PASSWORD` | `officer123` (change this!) |
| `CORS_ORIGINS` | `https://YOUR-APP.vercel.app` (fill in after Vercel deploy) |
| `GEMINI_API_KEY` | Your Google AI Studio key (optional) |

### 2d. Deploy
Click **Create Web Service** → wait ~3-5 mins.

Your backend URL will be: `https://lm-compliance-backend.onrender.com`

---

## Step 3: Deploy Frontend on Vercel

### 3a. Sign up at [vercel.com](https://vercel.com)

### 3b. Create a New Project
1. Click **New Project**
2. Import your GitHub repository
3. Fill in these settings:

| Setting | Value |
|---|---|
| **Root Directory** | `.` (project root) |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3c. Add Environment Variable
| Key | Value |
|---|---|
| `VITE_BACKEND_URL` | `https://lm-compliance-backend.onrender.com` |

### 3d. Deploy
Click **Deploy** → wait ~1-2 mins.

Your app URL will be: `https://lm-compliance.vercel.app`

---

## Step 4: Final Cross-Origin Fix

After both are deployed:
1. Go back to **Render dashboard → lm-compliance-backend → Environment**
2. Update `CORS_ORIGINS` to your actual Vercel URL:
   ```
   https://lm-compliance.vercel.app,https://lm-compliance-backend.onrender.com
   ```
3. Render will auto-redeploy.

---

## Sharing with Your Professor

Send them:
- **Live App**: `https://lm-compliance.vercel.app`
- **Login**: `officer@lm.gov.in` / `officer123`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/legal-metrology-compliance`

---

## Notes

- **Free Render tier sleeps** after 15 min inactivity — first request after idle takes ~30 sec to wake up. This is normal on free tier.
- **Data resets** on Render redeploy (TinyDB is a local file). For persistent storage, add a free MongoDB Atlas database.
- To **use Gemini AI Vision**, add your `GEMINI_API_KEY` environment variable on Render, OR users can enter it in the Scanner OCR Settings panel.
