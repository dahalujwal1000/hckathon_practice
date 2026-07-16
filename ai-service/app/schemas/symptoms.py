from pydantic import BaseModel, Field
from typing import List, Optional

class SymptomsRequest(BaseModel):
    symptoms: str = Field(..., min_length=1, max_length=2000, description="Description of symptoms")
    patient_history: Optional[str] = Field(None, max_length=5000, description="Optional medical history")
    patient_id: Optional[str] = Field(None, description="Patient identifier (if needed)")

class ConditionInfo(BaseModel):
    name: str = Field(..., description="Name of medical condition")
    probability: float = Field(..., ge=0, le=1, description="Probability of condition (0-1)")
    description: str = Field(..., description="Brief description of the condition")

class SymptomsResponse(BaseModel):
    conditions: List[ConditionInfo] = Field(..., description="List of possible conditions with probabilities")
    recommendations: List[str] = Field(..., description="Care recommendations")
    urgency: str = Field(..., pattern="^(low|medium|high|emergency)$", description="Urgency level")
    suggested_category: str = Field(..., description="Suggested doctor specialty/category")