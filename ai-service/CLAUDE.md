
## 📄 File 3: `ai-service/CLAUDE.md`

**Path:** `CLAUDE_CODE_HACKATHON/ai-service/CLAUDE.md`

```markdown
# AI Service (FastAPI) Rules — Nepal Health Hospital

> Read this BEFORE writing any AI service code.
> Root rules in `/CLAUDE.md` also apply.

---

## 🎯 Purpose

FastAPI is the **AI service only**. It handles:
- Chat conversations
- Symptom analysis
- Embeddings generation
- FAISS similarity search
- AI doctor recommendations
- Prompt engineering
- Context retrieval
- Conversation memory

**NestJS is the primary backend. This service is its AI proxy.**

---

## 🛠️ Stack

- **Framework:** FastAPI
API of kimi 2.7 is "Bearer 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" use this for api integration
- **Language:** Python 3.11+
- **Validation:** Pydantic v2
- **LLM:** Kimi 2.5 API (Moonshot AI) — OpenAI-compatible
- **Vector DB:** FAISS
- **Embeddings:** sentence-transformers (local) or Kimi embeddings
- **Server:** Uvicorn
- **HTTP Client:** httpx (async)

---

## 🏛️ Layer Architecture (NEVER bypass)

HTTP Request (from NestJS) ↓ ┌─────────────┐ │ Router │ ← Validates input, calls service, returns response └──────┬──────┘ ↓ ┌─────────────┐ │ Service │ ← Business logic for AI features └──────┬──────┘ ↓ ┌─────────────┐ │ Kimi / FAISS│ ← External services └─────────────┘


**Never skip the service layer.**

---

## 📁 Required Folder Structure

app/ ├── main.py ← FastAPI bootstrap │ ├── routers/ │ ├── chat.py │ ├── symptoms.py │ ├── recommend.py │ └── embeddings.py │ ├── services/ │ ├── kimi_service.py ← Kimi 2.5 API wrapper │ ├── embedding_service.py ← Embeddings generation │ ├── faiss_service.py ← FAISS index manager │ ├── prompt_service.py ← Prompt template loader │ └── context_service.py ← Context retrieval │ ├── schemas/ ← Pydantic models │ ├── chat.py │ ├── symptoms.py │ └── recommend.py │ ├── models/ ← Internal data shapes │ ├── core/ │ ├── config.py ← Settings (env-based) │ ├── security.py ← Verify NestJS internal token │ └── logging.py ← Centralized logging │ ├── prompts/ ← All prompt templates │ ├── symptom_triage.txt │ ├── doctor_recommend.txt │ └── chat_system.txt │ ├── vectorstore/ │ └── faiss_index/ ← Persisted FAISS index │ ├── middleware/ │ └── auth_middleware.py ← Verify NESTJS_INTERNAL_TOKEN │ ├── utils/ │ ├── json_parser.py │ └── text_splitter.py │ ├── constants/ │ ├── error_messages.py │ └── routes.py │ └── config/


---

## 🐍 Python Rules

- Follow PEP8 strictly
- Use type hints everywhere
- Use Pydantic v2 models for all I/O
- No global mutable state (use dependency injection)
- No duplicated logic
- Keep functions focused (single responsibility)
- Use `async`/`await` for I/O operations
- Use `pathlib.Path` instead of `os.path`

---

## 🤖 Kimi 2.5 API Rules

### What is Kimi?
Kimi is a free LLM API by Moonshot AI.
- Endpoint: `https://api.moonshot.cn/v1`
- Models: `moonshot-v1-8k`, `moonshot-v1-32k`, `moonshot-v1-128k`
- **OpenAI-compatible API** (use `openai` Python library)

### Required Packages
openai httpx


### Configuration
```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    KIMI_API_KEY: str
    KIMI_BASE_URL: str = "https://api.moonshot.cn/v1"
    KIMI_MODEL: str = "moonshot-v1-8k"
    NESTJS_INTERNAL_TOKEN: str
    FAISS_INDEX_PATH: str = "./vectorstore/faiss_index"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
Kimi Service
# app/services/kimi_service.py
from openai import AsyncOpenAI
from app.core.config import settings
from app.core.logging import logger
from fastapi import HTTPException

class KimiService:
    def __init__(self):
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
Kimi Rules
✅ Use OpenAI Python library (API-compatible)
✅ Use AsyncOpenAI for async
✅ Use moonshot-v1-8k for short conversations
✅ Use moonshot-v1-32k for longer context
✅ Set temperature=0.3 for structured/medical output
✅ Set temperature=0.7 for conversational
✅ Always set max_tokens
✅ Handle rate limits
❌ Never send patient PII unnecessarily
❌ Never log API keys
❌ Never log medical data
🔍 FAISS Rules
FAISS is ONLY for: embeddings, similarity search, AI memory, context retrieval
Never store business data only in FAISS
PostgreSQL is the source of truth
FAISS stores vectors + retrieval metadata
Persist index to disk in vectorstore/faiss_index/
Load index on startup, save on update
📋 Pydantic Schema Rules
All request/response models use Pydantic v2:

from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomsRequest(BaseModel):
    symptoms: str = Field(..., min_length=1, max_length=2000)
    patient_history: Optional[str] = Field(None, max_length=5000)
    patient_id: Optional[str] = None

class ConditionInfo(BaseModel):
    name: str
    probability: float = Field(..., ge=0, le=1)
    description: str

class SymptomsResponse(BaseModel):
    conditions: List[ConditionInfo]
    recommendations: List[str]
    urgency: str  # "low" | "medium" | "high" | "emergency"
    suggested_category: str
🌐 Response Format (matches NestJS)
{
  "success": true,
  "message": "",
  "data": {},
  "meta": {}
}
{
  "success": false,
  "message": "",
  "error": { "code": "ERROR_CODE", "details": [] }
}
Use a response wrapper helper:

# app/utils/response.py
def success_response(data: dict, message: str = "", meta: dict = None) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
        "meta": meta or {},
    }

def error_response(message: str, code: str = "ERROR", details: list = None) -> dict:
    return {
        "success": False,
        "message": message,
        "error": {"code": code, "details": details or []},
    }
🔐 Authentication with NestJS
NestJS sends requests with X-Internal-Token header. FastAPI verifies it.

# app/middleware/auth_middleware.py
from fastapi import Request, HTTPException
from app.core.config import settings

async def verify_nestjs_token(request: Request):
    token = request.headers.get("X-Internal-Token")
    if token != settings.NESTJS_INTERNAL_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
Apply to all routers:

# app/routers/symptoms.py
from fastapi import APIRouter, Depends
from app.middleware.auth_middleware import verify_nestjs_token

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"],
    dependencies=[Depends(verify_nestjs_token)],
)
⚠️ Error Handling
Use HTTPException from FastAPI
Centralized exception handler in main.py
Never raise raw errors
Never expose internal errors to NestJS
# app/main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.utils.response import error_response

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=error_response(
            message="Internal AI service error",
            code="AI_SERVICE_ERROR",
        ),
    )
📝 Logging
Use Python logging module
Never use print()
Never log: passwords, tokens, secrets, API keys, medical data
Log: request counts, errors, performance metrics
# app/core/logging.py
import logging
import sys

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger
📁 Prompts
Store all prompt templates in app/prompts/:

app/prompts/
├── symptom_triage.txt
├── doctor_recommend.txt
└── chat_system.txt
Load prompts via prompt_service:

# app/services/prompt_service.py
from pathlib import Path

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / f"{name}.txt"
    if not path.exists():
        raise FileNotFoundError(f"Prompt not found: {name}")
    return path.read_text(encoding="utf-8")
Example prompt: symptom_triage.txt
You are a medical triage assistant for Nepal Health Hospital.

Analyze the patient's symptoms and provide:
1. Possible conditions (with probability 0-1)
2. Care recommendations
3. Urgency level: low | medium | high | emergency
4. Suggested doctor category

IMPORTANT:
- Be conservative — recommend professional consultation for serious symptoms
- Use simple language
- Return valid JSON only
🗄️ Data to Kimi (CRITICAL)
NEVER send to Kimi:

❌ Passwords
❌ JWT tokens
❌ OAuth tokens
❌ API keys
❌ Database credentials
❌ Internal user IDs (use anonymized IDs if needed)
Safe to send to Kimi:

✅ Symptom descriptions (anonymized if possible)
✅ Age, gender (general)
✅ Retrieved FAISS context
✅ Conversation history
✅ Doctor categories
⚡ Performance
Cache expensive Kimi responses (in-memory for short term)
Batch embeddings where possible
Use async/await
Use FAISS index efficiently (avoid full scans)
Set reasonable max_tokens limits
Implement request timeouts
🔒 Security
Verify NestJS internal token on EVERY request
Use HTTPS in production
Sanitize user inputs
Implement rate limiting (slowapi)
Never expose API keys in responses
Never log sensitive data
⚙️ Configuration
Everything from env vars via pydantic-settings. Never hardcode.

# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)
    
    KIMI_API_KEY: str
    KIMI_BASE_URL: str = "https://api.moonshot.cn/v1"
    KIMI_MODEL: str = "moonshot-v1-8k"
    NESTJS_INTERNAL_TOKEN: str
    FAISS_INDEX_PATH: str = "./vectorstore/faiss_index"
    PORT: int = 8000
🔍 Code Quality
Before creating new code, search for:

Existing services
Existing utilities
Existing prompts
Existing schemas
Existing routers
Reuse before creating. Never duplicate.

📋 Before Writing Code
Claude must:

Read all related files
Understand current architecture
Explain the implementation plan
Identify reusable code
Avoid architectural conflicts
Ask questions if unclear
✅ Before Finishing
Verify:

 No Python errors
 No lint errors (pylint/flake8)
 No unused imports
 No circular dependencies
 No duplicated code
 No broken APIs
 No print() statements
 All endpoints have Pydantic validation
 Auth middleware applied
 Response format consistent
 No secrets in code
Then provide:

Summary of changed files
Architectural decisions
Potential risks
Manual testing checklist
