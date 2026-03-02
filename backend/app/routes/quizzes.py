from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import User, Quiz, UserProgress
from app.schemas import (
    QuizCreate, QuizResponse, QuizListResponse, QuizGenerateRequest,
    QuizAttempt, QuizResult, MessageResponse
)
from app.auth import get_current_user, get_current_user_optional
from app.services.gemini import GeminiService

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])
gemini_service = GeminiService()


@router.get("/", response_model=List[QuizListResponse])
async def get_quizzes(
    subject: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Quiz).filter(Quiz.is_public == True)
    
    if subject:
        query = query.filter(Quiz.subject.ilike(f"%{subject}%"))
    if difficulty:
        query = query.filter(Quiz.difficulty == difficulty)
    
    quizzes = query.order_by(Quiz.created_at.desc()).offset(offset).limit(limit).all()
    return quizzes


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # Check access for private quizzes
    if not quiz.is_public and (not current_user or quiz.creator_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return quiz


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    request: QuizGenerateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    try:
        # Generate quiz using Gemini
        questions = await gemini_service.generate_quiz(
            subject=request.subject,
            topic=request.topic,
            difficulty=request.difficulty,
            question_count=request.question_count,
            quiz_type=request.quiz_type
        )
        
        # Create title
        title = f"{request.subject}"
        if request.topic:
            title += f" - {request.topic}"
        title += f" ({request.difficulty.capitalize()})"
        
        # Create quiz in database
        quiz = Quiz(
            title=title,
            subject=request.subject,
            topic=request.topic,
            difficulty=request.difficulty,
            question_count=len(questions),
            questions=questions,
            creator_id=current_user.id if current_user else None,
            is_public=True
        )
        
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        return quiz
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate quiz: {str(e)}"
        )


@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(
    quiz_id: int,
    attempt: QuizAttempt,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get quiz
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # Calculate score
    questions = quiz.questions
    correct_answers = []
    wrong_answers = []
    
    for q in questions:
        q_id = q["id"]
        user_answer = attempt.answers.get(str(q_id))
        if user_answer and user_answer.upper() == q["correct_answer"].upper():
            correct_answers.append(q_id)
        else:
            wrong_answers.append(q_id)
    
    score = len(correct_answers)
    total = len(questions)
    percentage = (score / total) * 100 if total > 0 else 0
    
    # Save progress
    progress = UserProgress(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score,
        total_questions=total,
        time_taken=attempt.time_taken
    )
    db.add(progress)
    db.commit()
    
    return QuizResult(
        quiz_id=quiz_id,
        score=score,
        total_questions=total,
        percentage=percentage,
        correct_answers=correct_answers,
        wrong_answers=wrong_answers
    )


@router.delete("/{quiz_id}", response_model=MessageResponse)
async def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    if quiz.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own quizzes"
        )
    
    db.delete(quiz)
    db.commit()
    
    return MessageResponse(message="Quiz deleted successfully")
