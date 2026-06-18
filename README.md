# Quizify

Quizify is a coding-focused learning platform built with FastAPI and React. It helps users generate coding quizzes, create structured study notes, track quiz performance, and use an AI assistant for programming-related learning.

## Features

- JWT-based authentication with separate signup and login flows
- AI-generated coding quizzes with difficulty and topic controls
- AI-generated coding notes saved to a personal library
- Authenticated dashboard with recent activity and summary metrics
- Coding-only leaderboard based on quiz performance
- Coding-oriented AI assistant

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL / SQLite
- Pydantic
- python-jose
- Passlib

### AI

- Google Gemini API

## Architecture

```text
Quizify/
├── backend/
│   ├── api/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Product Scope

Quizify is currently scoped to coding topics only. Non-coding subjects are not part of the active application flow.

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker Desktop (optional, recommended for PostgreSQL)
- Gemini API key

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment Variables

Backend configuration is driven by environment variables.

Core values:

```env
DATABASE_URL=postgresql://quizify:quizify_password@localhost:5432/quizify
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

For frontend development:

```env
VITE_API_URL=http://localhost:8000/api
```

## Database

The project supports:

- PostgreSQL for the main development/deployment database
- SQLite as a lightweight local fallback

`docker-compose.yml` includes:

- `postgres` for the application database
- `adminer` for browser-based database access

Start database services:

```bash
docker-compose up -d postgres adminer
```

Adminer is available at `http://localhost:8080`.

## Docker

To run the full local stack:

```bash
docker-compose up --build
```

## Main Routes

### Frontend

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

### Backend API

- `/api/auth/*`
- `/api/dashboard/summary`
- `/api/quizzes/*`
- `/api/notes/*`
- `/api/leaderboard/*`
- `/api/ai/chat`

## Deployment Notes

- The repository includes Docker configuration for local containerized development.
- `backend/vercel.json` and `frontend/vercel.json` are included for Vercel-based deployment flows.
- The backend currently creates tables on startup through SQLAlchemy metadata initialization.

## Status

This repository is structured as a full-stack application with a coding-only product scope, authenticated dashboard flow, and integrated AI-backed quiz and notes generation.
