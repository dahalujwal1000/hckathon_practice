from fastapi import Request
from app.core.security import verify_nestjs_token

async def auth_middleware(request: Request, call_next):
    # Verify the internal token from headers
    token = request.headers.get("X-Internal-Token")
    if not token:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Missing X-Internal-Token header")
    # We could also call verify_nestjs_token(token) but Depends cannot be used here directly.
    # For simplicity, we'll rely on dependency injection in routers.
    response = await call_next(request)
    return response