from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import User, UserProgress, Quiz
from app.schemas import LeaderboardEntry, ProgressResponse

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])
CODING_SUBJECT = "Coding"


@router.get("/", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    subject: Optional[str] = None,
    time_period: Optional[str] = None,  # all-time, this-week, this-month
    limit: int = 10,
    db: Session = Depends(get_db)
):
    # Build query for user stats
    query = db.query(
        UserProgress.user_id,
        func.sum(UserProgress.score).label("total_score"),
        func.count(UserProgress.id).label("quizzes_completed"),
        func.avg(UserProgress.score * 100.0 / UserProgress.total_questions).label("average_score")
    ).join(Quiz, UserProgress.quiz_id == Quiz.id)
    
    # Filter by subject if provided
    query = query.filter(Quiz.subject == CODING_SUBJECT)
    
    # Filter by time period
    if time_period == "this-week":
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        query = query.filter(UserProgress.completed_at >= week_ago)
    elif time_period == "this-month":
        from datetime import datetime, timedelta
        month_ago = datetime.utcnow() - timedelta(days=30)
        query = query.filter(UserProgress.completed_at >= month_ago)
    
    # Group by user and order by total score
    results = query.group_by(UserProgress.user_id)\
        .order_by(func.sum(UserProgress.score).desc())\
        .limit(limit)\
        .all()
    
    # Build leaderboard entries with user names
    leaderboard = []
    for rank, result in enumerate(results, start=1):
        user = db.query(User).filter(User.id == result.user_id).first()
        if user:
            leaderboard.append(LeaderboardEntry(
                rank=rank,
                user_id=result.user_id,
                user_name=f"{user.first_name} {user.last_name}",
                total_score=int(result.total_score),
                quizzes_completed=result.quizzes_completed,
                average_score=round(float(result.average_score or 0), 2)
            ))
    
    return leaderboard


@router.get("/subjects", response_model=List[str])
async def get_subjects(db: Session = Depends(get_db)):
    """Get list of all quiz subjects for filtering"""
    return [CODING_SUBJECT]


@router.get("/user/{user_id}", response_model=List[ProgressResponse])
async def get_user_progress(
    user_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    progress_items = db.query(UserProgress)\
        .join(Quiz, UserProgress.quiz_id == Quiz.id)\
        .filter(UserProgress.user_id == user_id)\
        .filter(Quiz.subject == CODING_SUBJECT)\
        .order_by(UserProgress.completed_at.desc())\
        .limit(limit)\
        .all()
    
    results = []
    for p in progress_items:
        quiz = db.query(Quiz).filter(Quiz.id == p.quiz_id).first()
        if quiz:
            results.append(ProgressResponse(
                id=p.id,
                quiz_id=p.quiz_id,
                quiz_title=quiz.title,
                quiz_subject=quiz.subject,
                score=p.score,
                total_questions=p.total_questions,
                percentage=(p.score / p.total_questions) * 100 if p.total_questions > 0 else 0,
                time_taken=p.time_taken,
                completed_at=p.completed_at
            ))
    
    return results
