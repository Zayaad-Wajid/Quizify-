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
DATABASE_URL=postgresql://quizify:quizify_password@localhost:5432/quizify
SECRET_KEY=your-super-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

SQLite still works for local-only development, but the project now includes a full Postgres setup through Docker.

## Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Access

### Docker Database Stack

From the project root:

```bash
docker-compose up -d postgres adminer
```

Services:

- PostgreSQL: `localhost:5432`
- Adminer: `http://localhost:8080`

Default credentials from `.env.example`:

- System: `PostgreSQL`
- Server: `postgres` inside Docker, or `localhost` from your host machine
- Username: `quizify`
- Password: `quizify_password`
- Database: `quizify`

### Manual CRUD Options

1. Adminer in the browser
2. `psql` in the terminal
3. Any SQL client such as DBeaver, TablePlus, or pgAdmin

Example `psql` connection:

```bash
psql postgresql://quizify:quizify_password@localhost:5432/quizify
```
