from pydantic import BaseModel, Field
from typing import List, Optional

class DoctorRecommendRequest(BaseModel):
    specialty: Optional[str] = Field(None, description="Medical specialty (e.g., cardiology)")
    symptoms: Optional[str] = Field(None, description="Symptoms to match against")
    location: Optional[str] = Field(None, description="City or area for preferred location")
    limit: int = Field(10, ge=1, le=50, description="Maximum number of recommendations")

class DoctorInfo(BaseModel):
    id: str = Field(..., description="Doctor identifier")
    name: str = Field(..., description="Doctor's name")
    specialty: str = Field(..., description="Medical specialty")
    hospital: str = Field(..., description="Hospital or clinic name")
    rating: Optional[float] = Field(None, ge=0, le=5, description="Average rating")
    distance_km: Optional[float] = Field(None, description="Distance from location (if provided)")

class DoctorRecommendResponse(BaseModel):
    doctors: List[DoctorInfo] = Field(..., description="List of recommended doctors")
    total: int = Field(..., description="Total number of matching doctors")
    query_used: str = Field(..., description="Description of the query performed")