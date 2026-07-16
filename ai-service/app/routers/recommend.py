from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.recommend import DoctorRecommendRequest, DoctorRecommendResponse
from app.services.kimi_service import KimiService
from app.services.prompt_service import load_prompt
from app.core.security import verify_nestjs_token
from app.core.logging import logger

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI"],
    dependencies=[Depends(verify_nestjs_token)],
)

kimi_service = KimiService()

@router.post("/recommend-doctor", response_model=DoctorRecommendResponse)
async def recommend_doctor(request: DoctorRecommendRequest):
    """
    Recommend doctor specialization based on symptoms or query.
    """
    logger.info(f"Received recommendation request: {request.query[:100]}...")
    try:
        system_prompt = load_prompt("doctor_recommend")
        # For structured response, we expect JSON with fields: specialties, reason
        ai_response = await kimi_service.generate_json(
            system_prompt=system_prompt,
            user_message=request.query,
        )
        # Validate with Pydantic model
        response = RecommendResponse(**ai_response)
        return response
    except Exception as e:
        logger.error(f"Error in doctor recommendation: {e}")
        raise HTTPException(status_code=500, detail="Recommendation failed")