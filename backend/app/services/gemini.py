import httpx
import json
import re
from typing import List, Optional
from app.config import settings
from app.schemas import ChatMessage


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-2.0-flash"
    
    async def _generate_content(
        self,
        contents: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> str:
        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
        
        request_body = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
                "topP": 0.95,
                "topK": 40
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            ]
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, json=request_body)
            
            if response.status_code == 429:
                raise Exception("Rate limit exceeded. Please wait a minute and try again.")
            elif response.status_code == 404:
                raise Exception("Gemini model not found. Please check the model configuration.")
            elif response.status_code == 403:
                raise Exception("API key invalid or quota exceeded. Please check your Gemini API key.")
            
            response.raise_for_status()
            data = response.json()
        
        if not data.get("candidates") or not data["candidates"][0].get("content"):
            raise Exception("Invalid response from Gemini API")
        
        return data["candidates"][0]["content"]["parts"][0]["text"]
    
    async def generate_quiz(
        self,
        subject: str,
        topic: Optional[str] = None,
        difficulty: str = "medium",
        question_count: int = 5,
        quiz_type: str = "multiple-choice"
    ) -> List[dict]:
        prompt = f"""Generate a {difficulty} difficulty quiz about {subject}"""
        if topic:
            prompt += f", specifically about {topic}"
        prompt += f""", with exactly {question_count} questions.

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks.

Return the response in this exact JSON format:
{{
    "questions": [
        {{
            "id": 1,
            "question": "What is...",
            "options": [
                {{"label": "A", "text": "Option 1"}},
                {{"label": "B", "text": "Option 2"}},
                {{"label": "C", "text": "Option 3"}},
                {{"label": "D", "text": "Option 4"}}
            ],
            "correct_answer": "A",
            "explanation": "This is correct because..."
        }}
    ]
}}

Make sure:
1. Each question has exactly 4 options (A, B, C, D)
2. correct_answer is just the letter (A, B, C, or D)
3. Questions are factually accurate
4. Difficulty matches the {difficulty} level requested
"""
        
        contents = [{"role": "user", "parts": [{"text": prompt}]}]
        
        response_text = await self._generate_content(contents, temperature=0.7, max_tokens=4096)
        
        # Clean up response - remove markdown code blocks if present
        cleaned = response_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        try:
            data = json.loads(cleaned)
            return data.get("questions", [])
        except json.JSONDecodeError:
            # Try to extract JSON from the response
            match = re.search(r'\{[\s\S]*\}', cleaned)
            if match:
                try:
                    data = json.loads(match.group())
                    return data.get("questions", [])
                except:
                    pass
            raise Exception("Failed to parse quiz questions from AI response")
    
    async def generate_notes(
        self,
        subject: str,
        topic: str,
        detail_level: str = "medium"
    ) -> str:
        detail_instructions = {
            "brief": "Keep the notes concise, with key points and definitions only. About 300-500 words.",
            "medium": "Provide moderately detailed notes with explanations and examples. About 700-1000 words.",
            "comprehensive": "Provide comprehensive notes with detailed explanations, multiple examples, and additional context. About 1500-2000 words."
        }
        
        prompt = f"""Create study notes about {topic} in the subject of {subject}.

{detail_instructions.get(detail_level, detail_instructions["medium"])}

Structure the notes with:
1. Introduction/Overview
2. Key Concepts
3. Important Formulas/Rules (if applicable)
4. Examples
5. Summary/Key Takeaways

Use markdown formatting for better readability (headers, bullet points, bold text, etc.).
"""
        
        contents = [{"role": "user", "parts": [{"text": prompt}]}]
        
        return await self._generate_content(contents, temperature=0.7, max_tokens=4096)
    
    async def chat(
        self,
        messages: List[ChatMessage],
        context: Optional[str] = None
    ) -> str:
        contents = []
        
        # Add system context as first user message
        system_prompt = """You are Quizify Assistant, an AI learning helper. You help students with:
- Explaining concepts
- Answering questions about various subjects
- Providing study tips
- Helping with quiz preparation

Be friendly, educational, and encouraging. Use examples when helpful."""
        
        if context:
            system_prompt += f"\n\nCurrent context: {context}"
        
        contents.append({
            "role": "user",
            "parts": [{"text": f"System instructions: {system_prompt}"}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "I understand. I'll act as Quizify Assistant and help with learning questions."}]
        })
        
        # Add conversation messages
        for msg in messages:
            role = "model" if msg.role == "assistant" else "user"
            contents.append({
                "role": role,
                "parts": [{"text": msg.content}]
            })
        
        return await self._generate_content(contents, temperature=0.7, max_tokens=1024)
