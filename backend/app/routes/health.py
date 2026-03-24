from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Keep-alive endpoint. Frontend pings this every 20s to prevent Render sleep."""
    return HealthResponse(status="ok", message="SkillPrism API is alive 🔮")


@router.get("/", tags=["Health"])
async def root():
    return {"name": "SkillPrism API", "version": "1.0.0", "status": "running"}
