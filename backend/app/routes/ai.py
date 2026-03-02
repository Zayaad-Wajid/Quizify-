from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import ChatRequest, ChatResponse
from app.auth import get_current_user_optional
from app.models import User
from app.services.gemini import GeminiService
from typing import Optional

router = APIRouter(prefix="/ai", tags=["AI Assistant"])
gemini_service = GeminiService()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    try:
        response = await gemini_service.chat(
            messages=request.messages,
            context=request.context
        )
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get AI response: {str(e)}"
        )
