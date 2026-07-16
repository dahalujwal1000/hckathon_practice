from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.kimi_service import KimiService
from app.services.prompt_service import load_prompt
from app.core.security import verify_nestjs_token
from app.core.logging import logger
from typing import Dict, List
import uuid

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"],
    dependencies=[Depends(verify_nestjs_token)],
)

kimi_service = KimiService()
# In-memory conversation store: {conversation_id: [{"role": "...", "content": "..."}]}
_conversations: Dict[str, List[dict]] = {}

def _get_or_create_conversation(conversation_id: Optional[str]) -> str:
    if not conversation_id or conversation_id not in _conversations:
        new_id = str(uuid.uuid4())
        _conversations[new_id] = []
        return new_id
    return conversation_id

def _append_message(conversation_id: str, role: str, content: str):
    if conversation_id in _conversations:
        _conversations[conversation_id].append({"role": role, "content": content})
    # Keep history to a reasonable length (e.g., last 20 messages)
    if len(_conversations[conversation_id]) > 20:
        _conversations[conversation_id] = _conversations[conversation_id][-20:]

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint with conversation memory.
    """
    logger.info(f"Received chat message: {request.message[:100]}...")
    try:
        system_prompt = load_prompt("chat_system")
        conv_id = _get_or_create_conversation(request.conversation_id)
        # Build conversation history for context
        history = _conversations.get(conv_id, [])
        # We'll concatenate recent messages as context (could also pass separately)
        # For simplicity, we'll prepend history as part of user message or use system message.
        # We'll create a combined prompt: system + history + current user message.
        # However Kimi expects a single system prompt and user message.
        # We'll combine history into the user message with clear labels.
        history_text = ""
        if history:
            history_text = "Previous conversation:\n"
            for msg in history:
                role = "User" if msg["role"] == "user" else "Assistant"
                history_text += f"{role}: {msg['content']}\n"
            history_text += "\n"
        user_message = f"{history_text}Current message: {request.message}"
        # Get response from Kimi
        ai_response = await kimi_service.generate(
            system_prompt=system_prompt,
            user_message=user_message,
            temperature=0.7,
            max_tokens=500,
        )
        # Store messages
        _append_message(conv_id, "user", request.message)
        _append_message(conv_id, "assistant", ai_response)
        return ChatResponse(response=ai_response, conversation_id=conv_id)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="Chat failed")