from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    conversation_id: Optional[str] = Field(None, description="Optional conversation identifier to maintain context")
    # Optional: could include patient_id, etc.

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI response message")
    conversation_id: Optional[str] = Field(None, description="Conversation identifier (if provided or newly created)")
    # Could also include suggested actions, etc.