from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging import logger
from app.core.config import get_settings
from app.utils.response import success_response, error_response
from app.routers import symptoms, chat, recommend

# Create FastAPI app
app = FastAPI(
    title="Nepal Health Hospital AI Service",
    description="AI microservice powered by Kimi 2.5 and FAISS for symptom triage, chat, and doctor recommendation.",
    version="0.1.0",
)

# Load settings
settings = get_settings()

# CORS middleware (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(symptoms.router)
app.include_router(chat.router)
app.include_router(recommend.router)

# Optional: health check endpoint
@app.get("/health")
async def health_check():
    return success_response({"status": "ok", "service": "ai-service"}, message="Service is healthy")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=error_response(
            message="Internal AI service error",
            code="AI_SERVICE_ERROR",
            details=["An unexpected error occurred"],
        ),
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting AI Service...")
    # Ensure FAISS index directory exists
    from pathlib import Path
    Path(settings.FAISS_INDEX_PATH).parent.mkdir(parents=True, exist_ok=True)
    logger.info("AI Service started successfully.")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down AI Service...")
    # Optionally save FAISS index
    from app.services.faiss_service import FaissService
    # Note: we rely on individual services saving; could call a global flush if needed.
    logger.info("AI Service shutdown complete.")