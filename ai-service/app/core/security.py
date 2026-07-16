from fastapi import Header, HTTPException
from app.core.config import get_settings

def verify_nestjs_token(x_internal_token: str = Header(...)):
    """Verify the internal token from NestJS"""
    settings = get_settings()
    if x_internal_token != settings.NESTJS_INTERNAL_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True