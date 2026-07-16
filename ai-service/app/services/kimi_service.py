from openai import AsyncOpenAI
from app.core.config import get_settings
from app.core.logging import logger
from fastapi import HTTPException

class KimiService:
    def __init__(self):
        settings = get_settings()
        self.client = AsyncOpenAI(
            api_key=settings.KIMI_API_KEY,
            base_url=settings.KIMI_BASE_URL,
        )
        self.model = settings.KIMI_MODEL

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Kimi API error: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="AI service temporarily unavailable"
            )

    async def generate_json(
        self,
        system_prompt: str,
        user_message: str,
    ) -> dict:
        """For structured responses"""
        json_prompt = f"{system_prompt}\n\nIMPORTANT: Respond with valid JSON only. No markdown."
        response = await self.generate(json_prompt, user_message, temperature=0.3)

        import json
        try:
            clean = response.strip()
            if clean.startswith("```json"):
                clean = clean[7:]
            if clean.endswith("```"):
                clean = clean[:-3]
            return json.loads(clean.strip())
        except json.JSONDecodeError:
            logger.error(f"Failed to parse Kimi JSON: {response}")
            raise HTTPException(
                status_code=500,
                detail="AI returned invalid format"
            )