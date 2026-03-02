from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Quizify API"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./quizify.db"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Gemini API
    GEMINI_API_KEY: str = "AIzaSyDWL7gj7XIHqvGIvoW5OJTowegOZdSdVHg"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"]
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
