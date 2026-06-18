from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User, UserNote
from app.schemas import (
    NoteCreate, NoteUpdate, NoteResponse, NotesGenerateRequest, MessageResponse
)
from app.auth import get_current_user
from app.services.gemini import GeminiService

router = APIRouter(prefix="/notes", tags=["Notes"])
gemini_service = GeminiService()
CODING_SUBJECT = "Coding"


@router.get("/", response_model=List[NoteResponse])
async def get_notes(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(UserNote).filter(
        UserNote.user_id == current_user.id,
        UserNote.subject == CODING_SUBJECT,
    )
    
    if category and category != "all":
        query = query.filter(UserNote.category == category)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (UserNote.title.ilike(search_term)) |
            (UserNote.subject.ilike(search_term)) |
            (UserNote.content.ilike(search_term))
        )
    
    notes = query.order_by(UserNote.created_at.desc()).offset(offset).limit(limit).all()
    return notes


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(UserNote).filter(
        UserNote.id == note_id,
        UserNote.user_id == current_user.id,
        UserNote.subject == CODING_SUBJECT,
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return note


@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = UserNote(
        user_id=current_user.id,
        title=note_data.title,
        subject=CODING_SUBJECT,
        topic=note_data.topic,
        content=note_data.content,
        category="coding",
    )
    
    db.add(note)
    db.commit()
    db.refresh(note)
    
    return note


@router.post("/generate", response_model=NoteResponse)
async def generate_notes(
    request: NotesGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        requested_subject = (request.subject or "").strip().lower()
        if requested_subject and requested_subject != "coding":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quizify only supports coding notes.",
            )

        # Generate notes using Gemini
        content = await gemini_service.generate_notes(
            subject=CODING_SUBJECT,
            topic=request.topic,
            detail_level=request.detail_level
        )
        
        # Create note in database
        note = UserNote(
            user_id=current_user.id,
            title=f"{CODING_SUBJECT}: {request.topic}",
            subject=CODING_SUBJECT,
            topic=request.topic,
            content=content,
            category="coding"
        )
        
        db.add(note)
        db.commit()
        db.refresh(note)
        
        return note
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate notes: {str(e)}"
        )


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(UserNote).filter(
        UserNote.id == note_id,
        UserNote.user_id == current_user.id,
        UserNote.subject == CODING_SUBJECT,
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Update fields
    update_data = note_data.model_dump(exclude_unset=True)
    update_data.pop("subject", None)
    if "category" in update_data:
        update_data["category"] = "coding"
    for field, value in update_data.items():
        setattr(note, field, value)
    
    db.commit()
    db.refresh(note)
    
    return note


@router.delete("/{note_id}", response_model=MessageResponse)
async def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(UserNote).filter(
        UserNote.id == note_id,
        UserNote.user_id == current_user.id,
        UserNote.subject == CODING_SUBJECT,
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    db.delete(note)
    db.commit()
    
    return MessageResponse(message="Note deleted successfully")


@router.post("/{note_id}/favorite", response_model=NoteResponse)
async def toggle_favorite(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(UserNote).filter(
        UserNote.id == note_id,
        UserNote.user_id == current_user.id,
        UserNote.subject == CODING_SUBJECT,
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    note.is_favorite = not note.is_favorite
    db.commit()
    db.refresh(note)
    
    return note
