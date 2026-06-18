---
title: Quizify API
emoji: "🚀"
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# Quizify Backend

FastAPI backend for the Quizify coding learning platform.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment

Create `backend/.env` or provide these values through your shell:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
SECRET_KEY=your-super-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

For Hugging Face deployment, set these as Space Variables/Secrets in the Space Settings.

## Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Hugging Face Deployment Notes

- This backend is intended to be deployed as a Docker Space.
- Hugging Face Docker Spaces expose a single public port, configured here as `7860`.
- Use a managed external PostgreSQL database for live deployment.
- Recommended free-tier database providers: Neon or Supabase.
