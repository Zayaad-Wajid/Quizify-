from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routes import auth, quizzes, notes, leaderboard, ai

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Interactive Learning Platform API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(quizzes.router, prefix="/api")
app.include_router(notes.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(ai.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Quizify API",
        "version": "2.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
