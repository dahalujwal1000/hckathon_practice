from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.symptoms import SymptomsRequest, SymptomsResponse
from app.services.kimi_service import KimiService
from app.services.embedding_service import EmbeddingService
from app.services.faiss_service import FaissService
from app.services.context_service import ContextService
from app.services.prompt_service import load_prompt
from app.core.security import verify_nestjs_token
from app.core.logging import logger

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"],
    dependencies=[Depends(verify_nestjs_token)],
)

# Initialize services (singleton pattern)
kimi_service = KimiService()
embedding_service = EmbeddingService()
faiss_service = FaissService()
context_service = ContextService()

@router.post("/symptoms", response_model=SymptomsResponse)
async def symptom_triage(request: SymptomsRequest):
    """
    Analyze symptoms and return possible conditions, recommendations, urgency, and suggested department.
    """
    logger.info(f"Received symptom request: {request.symptoms[:100]}...")
    try:
        # Load prompt template
        system_prompt = load_prompt("symptom_triage")
        # Optionally enrich with context from FAISS (e.g., similar past cases)
        # For now, we just use the symptom text.
        user_message = f"Symptoms: {request.symptoms}"
        if request.patient_history:
            user_message += f"\nPatient history: {request.patient_history}"
        # Get JSON response from Kimi
        result: dict = await kimi_service.generate_json(system_prompt, user_message)
        # Validate and return
        response = SymptomsResponse(**result)
        return response
    except Exception as e:
        logger.error(f"Error in symptom triage: {e}")
        raise HTTPException(status_code=500, detail="Symptom analysis failed")