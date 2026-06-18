# Quizify

Quizify is a coding-focused learning platform built with FastAPI and React. It generates coding quizzes, produces coding study notes, tracks quiz performance, and provides an AI assistant for programming-related study help.

## Scope

Quizify is now coding-only.

- Coding quizzes only
- Coding notes only
- Coding-focused leaderboard
- Coding-oriented AI assistant

The app no longer supports mathematics, physics, science, or other non-coding domains in the active product flow.

## Features

### Authentication

- Email/password signup
- Login with JWT access and refresh tokens
- Protected routes for authenticated features
- Signup and login are separate flows

### Coding Quizzes

- AI-generated quizzes for coding topics
- Difficulty levels: easy, medium, hard
- Multiple question-count options
- Quiz attempts saved for authenticated users
- Leaderboard based on coding quiz performance

### Coding Notes

- AI-generated coding study notes in Markdown
- Saved personal notes library
- Favorite notes support
- Search and filter within saved notes

### Dashboard

- Dedicated authenticated dashboard at `/dashboard`
- Real backend aggregate counts
- Recent quizzes
- Recent notes
- Recent coding quiz activity

### AI Assistant

- Coding-focused study assistant
- Programming concept explanations
- Study help for coding topics
- Debugging and interview-prep style guidance

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- Axios
- React Hot Toast
- React Markdown
- Lucide React

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- python-jose
- Passlib
- HTTPX

### AI

- Google Gemini API

## Project Structure

```text
Quizify/
├── backend/
│   ├── api/
│   │   └── index.py
│   ├── app/
│   │   ├── routes/
│   │   │   ├── ai.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── leaderboard.py
│   │   │   ├── notes.py
│   │   │   └── quizzes.py
│   │   ├── services/
│   │   │   └── gemini.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── vercel.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   ├── pages/
│   │   │   ├── Assistant.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NoteGenerator.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── QuizGenerator.jsx
│   │   │   ├── Quizzes.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── TakeQuiz.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm
- Gemini API key

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` or provide environment variables:

```env
DATABASE_URL=sqlite:///./quizify.db
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
DEBUG=true
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
```

Optional frontend env:

```env
VITE_API_URL=http://localhost:8000/api
```

Run the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Docker

From the project root:

```bash
docker-compose up --build
```

This starts:

- frontend app
- backend API
- PostgreSQL database
- Adminer database UI

## Database Setup

Quizify now includes a complete project database stack based on PostgreSQL.

### Included Services

- PostgreSQL: primary application database
- Adminer: browser-based database management UI for manual CRUD

### Default Local Database Credentials

These come from `.env.example` and can be changed before startup:

```env
POSTGRES_DB=quizify
POSTGRES_USER=quizify
POSTGRES_PASSWORD=quizify_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DATABASE_URL=postgresql://quizify:quizify_password@localhost:5432/quizify
```

### Start Only the Database Tools

```bash
docker-compose up -d postgres adminer
```

### Access the Database

#### Option 1: Adminer

Open:

`http://localhost:8080`

Use:

- System: `PostgreSQL`
- Server: `postgres` when connecting from inside Docker Adminer
- Username: `quizify`
- Password: `quizify_password`
- Database: `quizify`

#### Option 2: psql

```bash
psql postgresql://quizify:quizify_password@localhost:5432/quizify
```

#### Option 3: Desktop SQL Client

You can connect with DBeaver, pgAdmin, TablePlus, or any PostgreSQL client using:

- Host: `localhost`
- Port: `5432`
- Database: `quizify`
- Username: `quizify`
- Password: `quizify_password`

### Manual CRUD Examples

List tables:

```sql
\dt
```

Read users:

```sql
SELECT id, first_name, last_name, email, created_at
FROM users
ORDER BY id DESC;
```

Insert a note manually:

```sql
INSERT INTO user_notes (user_id, title, subject, topic, content, category, is_favorite)
VALUES (1, 'Coding: SQL Basics', 'Coding', 'SQL Basics', 'Manual note content', 'coding', false);
```

Update a quiz title:

```sql
UPDATE quizzes
SET title = 'Coding - Arrays (Medium)'
WHERE id = 1;
```

Delete a note:

```sql
DELETE FROM user_notes
WHERE id = 1;
```

### Schema Creation

The backend creates tables automatically on startup through SQLAlchemy metadata initialization in `backend/app/main.py`.

That means:

- start Postgres
- start backend
- tables will be created automatically if they do not exist

### Database Compatibility

- Docker-first setup uses PostgreSQL
- backend still supports SQLite if you point `DATABASE_URL` to a SQLite file
- engine config now handles SQLite and PostgreSQL correctly

## Main Routes

### Frontend Routes

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

### Backend API Routes

#### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`

#### Dashboard

- `GET /api/dashboard/summary`

#### Quizzes

- `GET /api/quizzes`
- `GET /api/quizzes/{quiz_id}`
- `POST /api/quizzes/generate`
- `POST /api/quizzes/{quiz_id}/submit`
- `DELETE /api/quizzes/{quiz_id}`

#### Notes

- `GET /api/notes`
- `GET /api/notes/{note_id}`
- `POST /api/notes`
- `POST /api/notes/generate`
- `PUT /api/notes/{note_id}`
- `DELETE /api/notes/{note_id}`
- `POST /api/notes/{note_id}/favorite`

#### Leaderboard

- `GET /api/leaderboard`
- `GET /api/leaderboard/subjects`
- `GET /api/leaderboard/user/{user_id}`

#### AI

- `POST /api/ai/chat`

## Current Product Behavior

- Signup creates an account but does not log the user in
- Login redirects users to the dashboard
- Dashboard metrics come from backend aggregates
- Quiz and notes generation are restricted to coding content
- Non-coding subject flows are removed from the UI

## Deployment

The repository includes:

- `docker-compose.yml` for local containerized development
- `backend/vercel.json` for backend deployment
- `frontend/vercel.json` for frontend deployment

## Notes

- Existing non-coding data may still exist in the database, but the active app flow now surfaces coding content only.
- The backend uses SQLite by default for local development.
