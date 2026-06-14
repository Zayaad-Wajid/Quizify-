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
        self.model = "gemini-2.5-flash"
    
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
            "brief": "Be concise. Each section should be focused and tight — aim for 350-500 words total.",
            "medium": "Provide balanced depth with clear explanations and at least one example per concept — aim for 800-1100 words total.",
            "comprehensive": "Be thorough: multiple examples, deeper explanations, common misconceptions, and extended further reading — aim for 1600-2200 words total."
        }

        from datetime import date
        today = date.today().strftime("%B %d, %Y")

        prompt = f"""You are an expert academic tutor. Generate a professionally structured study note document for the following:

Subject: {subject}
Topic: {topic}
Detail Level: {detail_level.capitalize()}
Date: {today}

Instruction: {detail_instructions.get(detail_level, detail_instructions["medium"])}

Produce the notes in clean Markdown following EXACTLY this structure. Do not skip any section. Use the exact section headings shown.

---

# {topic}

**Subject:** {subject} &nbsp;|&nbsp; **Detail Level:** {detail_level.capitalize()} &nbsp;|&nbsp; **Date:** {today}

---

## I. Introduction

Write a 2–4 sentence overview that explains what this topic is, why it matters, and what the student will understand after reading these notes.

---

## II. Key Concepts

List the 3–6 most important concepts for this topic. For each one use this format:

**Concept N — [Concept Name]:** A clear, precise definition or explanation of the concept.

---

## III. In-Depth Explanations

For each concept listed in Section II, write a dedicated sub-section that expands on it with additional context, how it relates to other concepts, and why it is important.

### [Concept Name]
[Expanded explanation here]

---

## IV. Formulas, Rules & Notation *(skip this section only if the topic has absolutely no formulas or formal rules)*

Present every relevant formula or rule in a clear format. Use LaTeX-style notation wrapped in backticks if needed. Briefly explain each one.

---

## V. Worked Examples

Provide {"1 worked example" if detail_level == "brief" else "2–3 worked examples" if detail_level == "medium" else "3–5 worked examples"} that illustrate the concepts. Show step-by-step reasoning where applicable.

**Example 1:**
> [Problem statement]

**Solution:**
[Step-by-step solution]

---

## VI. Common Mistakes & Misconceptions

List 2–4 mistakes students commonly make with this topic and how to avoid them.

---

## VII. Quick Review Questions

Write {"3" if detail_level == "brief" else "5" if detail_level == "medium" else "7"} short review questions to test understanding. Number them.

1. [Question]

---

## VIII. Key Takeaways

Provide a tight bullet-point summary of the most important points a student must remember.

- [Takeaway]

---

## IX. Further Reading & Resources

Suggest 2–4 specific, credible resources (textbooks, official docs, reputable websites) relevant to this topic.

- [Resource]

---

IMPORTANT: Output only the Markdown document above. Do not add any preamble, commentary, or closing remarks outside the document structure.
"""

        contents = [{"role": "user", "parts": [{"text": prompt}]}]

        return await self._generate_content(contents, temperature=0.4, max_tokens=4096)
    
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
