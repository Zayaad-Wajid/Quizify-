from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime


# ========== User Schemas ==========
class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    confirm_password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember: bool = False


class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserWithStats(UserResponse):
    total_quizzes: int = 0
    total_score: int = 0
    average_score: float = 0.0


# ========== Token Schemas ==========
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


# ========== Quiz Schemas ==========
class QuestionOption(BaseModel):
    label: str
    text: str


class Question(BaseModel):
    id: int
    question: str
    options: List[QuestionOption]
    correct_answer: str
    explanation: Optional[str] = None


class QuizBase(BaseModel):
    title: str
    subject: str
    topic: Optional[str] = None
    difficulty: str = "medium"


class QuizCreate(QuizBase):
    question_count: int = 5
    quiz_type: str = "multiple-choice"


class QuizResponse(QuizBase):
    id: int
    question_count: int
    questions: List[Question]
    creator_id: Optional[int] = None
    is_public: bool = True
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuizListResponse(QuizBase):
    id: int
    question_count: int
    creator_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ========== Quiz Attempt Schemas ==========
class QuizAttempt(BaseModel):
    quiz_id: int
    answers: dict  # {question_id: answer}
    time_taken: Optional[int] = None


class QuizResult(BaseModel):
    quiz_id: int
    score: int
    total_questions: int
    percentage: float
    correct_answers: List[int]
    wrong_answers: List[int]


# ========== User Progress Schemas ==========
class ProgressResponse(BaseModel):
    id: int
    quiz_id: int
    quiz_title: str
    quiz_subject: str
    score: int
    total_questions: int
    percentage: float
    time_taken: Optional[int]
    completed_at: datetime
    
    class Config:
        from_attributes = True


# ========== Leaderboard Schemas ==========
class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    user_name: str
    total_score: int
    quizzes_completed: int
    average_score: float


# ========== Note Schemas ==========
class NoteBase(BaseModel):
    title: str
    subject: str
    topic: Optional[str] = None
    content: str
    category: str = "general"


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_favorite: Optional[bool] = None


class NoteResponse(NoteBase):
    id: int
    user_id: int
    is_favorite: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ========== AI Generation Schemas ==========
class QuizGenerateRequest(BaseModel):
    subject: str
    topic: Optional[str] = None
    difficulty: str = "medium"
    question_count: int = 5
    quiz_type: str = "multiple-choice"


class NotesGenerateRequest(BaseModel):
    subject: str
    topic: str
    detail_level: str = "medium"  # brief, medium, comprehensive


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None


class ChatResponse(BaseModel):
    response: str


# ========== Generic Response ==========
class MessageResponse(BaseModel):
    message: str
    success: bool = True
