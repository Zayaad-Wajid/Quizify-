# Quizify

Quizify is a coding-focused learning platform built with FastAPI and React. It generates coding quizzes, creates structured study notes, tracks user progress, and includes an AI assistant for programming-related learning.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic
- Auth: JWT
- Database: PostgreSQL or SQLite
- AI: Google Gemini API

## Product Scope

Quizify is scoped to coding topics only.

Core flows:

- signup and login
- coding quiz generation and quiz attempts
- coding note generation and saved notes
- authenticated dashboard and leaderboard
- coding-focused AI assistant

## Project Structure

```text
Quizify/
|-- backend/
|   |-- app/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- auth.py
|   |   |-- config.py
|   |   |-- database.py
|   |   |-- main.py
|   |   |-- models.py
|   |   `-- schemas.py
|   |-- Dockerfile
|   |-- README.md
|   `-- requirements.txt
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- store/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   |-- vercel.json
|   `-- vite.config.js
|-- docker-compose.yml
`-- README.md
```

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker Desktop for the local PostgreSQL stack

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Core backend variables:

```env
DATABASE_URL=postgresql://username:password@host:5432/database
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

Frontend:

```env
VITE_API_URL=http://localhost:8000/api
```

## Deployment

### Frontend: Vercel

The frontend is configured for Vercel deployment as a Vite SPA.

Set:

```env
VITE_API_URL=https://your-huggingface-space.hf.space/api
```

in the Vercel project environment variables before deploying.

### Backend: Hugging Face Spaces

The backend is set up for deployment as a Hugging Face Docker Space.

Required Hugging Face Space variables/secrets:

- `DATABASE_URL`
- `SECRET_KEY`
- `GEMINI_API_KEY`

The backend Docker image is configured to serve on port `7860`, which matches Hugging Face Docker Spaces requirements.

### Production Database

For live deployment, use an external managed PostgreSQL database.

Good free-tier options:

- Neon
- Supabase

The backend already supports a full PostgreSQL connection string through `DATABASE_URL`.

## Database Access

For local development, `docker-compose.yml` includes:

- `postgres`
- `adminer`

Start them with:

```bash
docker-compose up -d postgres adminer
```

Adminer runs at:

`http://localhost:8080`

## Main Routes

Frontend routes:

- `/`
- `/signup`
- `/login`
- `/dashboard`
- `/quizzes`
- `/quizzes/generate`
- `/quizzes/:id`
- `/notes`
- `/notes/generate`
- `/leaderboard`
- `/assistant`

Backend routes:

- `/api/auth/*`
- `/api/dashboard/summary`
- `/api/quizzes/*`
- `/api/notes/*`
- `/api/leaderboard/*`
- `/api/ai/chat`

## Notes

- The frontend and backend are intentionally deployed separately.
- The backend no longer targets Vercel in this repository.
- The current backend creates tables automatically on startup.
