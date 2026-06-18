from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Quiz, User, UserNote, UserProgress
from app.schemas import DashboardSummaryResponse, ProgressResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

CODING_SUBJECT = "Coding"


@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quizzes_available = (
        db.query(func.count(Quiz.id))
        .filter(Quiz.is_public == True, Quiz.subject == CODING_SUBJECT)
        .scalar()
        or 0
    )
    saved_notes = (
        db.query(func.count(UserNote.id))
        .filter(UserNote.user_id == current_user.id, UserNote.subject == CODING_SUBJECT)
        .scalar()
        or 0
    )

    progress_query = (
        db.query(UserProgress)
        .join(Quiz, UserProgress.quiz_id == Quiz.id)
        .filter(
            UserProgress.user_id == current_user.id,
            Quiz.subject == CODING_SUBJECT,
        )
    )

    quizzes_taken = progress_query.count()
    average_score = (
        db.query(func.avg(UserProgress.score * 100.0 / UserProgress.total_questions))
        .join(Quiz, UserProgress.quiz_id == Quiz.id)
        .filter(
            UserProgress.user_id == current_user.id,
            Quiz.subject == CODING_SUBJECT,
        )
        .scalar()
        or 0
    )

    recent_quizzes = (
        db.query(Quiz)
        .filter(Quiz.is_public == True, Quiz.subject == CODING_SUBJECT)
        .order_by(Quiz.created_at.desc())
        .limit(3)
        .all()
    )
    recent_notes = (
        db.query(UserNote)
        .filter(UserNote.user_id == current_user.id, UserNote.subject == CODING_SUBJECT)
        .order_by(UserNote.created_at.desc())
        .limit(3)
        .all()
    )
    progress_items = (
        progress_query.order_by(UserProgress.completed_at.desc()).limit(3).all()
    )

    recent_progress = []
    for item in progress_items:
        quiz = (
            db.query(Quiz)
            .filter(Quiz.id == item.quiz_id, Quiz.subject == CODING_SUBJECT)
            .first()
        )
        if not quiz:
            continue

        recent_progress.append(
            ProgressResponse(
                id=item.id,
                quiz_id=item.quiz_id,
                quiz_title=quiz.title,
                quiz_subject=quiz.subject,
                score=item.score,
                total_questions=item.total_questions,
                percentage=(item.score / item.total_questions) * 100
                if item.total_questions > 0
                else 0,
                time_taken=item.time_taken,
                completed_at=item.completed_at,
            )
        )

    return DashboardSummaryResponse(
        quizzes_available=int(quizzes_available),
        saved_notes=int(saved_notes),
        quizzes_taken=int(quizzes_taken),
        average_score=round(float(average_score), 2),
        recent_quizzes=recent_quizzes,
        recent_notes=recent_notes,
        recent_progress=recent_progress,
    )
