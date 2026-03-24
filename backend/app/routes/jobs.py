import logging
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.skills_extractor import extract_skills
from app.services.job_matcher import calculate_match
from app.services.groq_analyzer import stream_gap_analysis
from app.models.schemas import MatchRequest, MatchResult, StreamRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("/match", response_model=MatchResult)
async def match_job(request: MatchRequest):
    """Extract skills from both CV and job description, return match score."""
    cv_skills, cv_by_cat = extract_skills(request.cv_text)
    job_skills, _ = extract_skills(request.job_description)

    result = calculate_match(cv_skills, job_skills)

    return MatchResult(
        score=result["score"],
        matched_skills=result["matched_skills"],
        missing_skills=result["missing_skills"],
        cv_skills=cv_skills,
        job_skills=job_skills,
        skills_by_category=result["skills_by_category"],
        label=result["label"],
        color=result["color"],
    )


@router.post("/analyze")
async def stream_analysis(request: StreamRequest):
    """Stream gap analysis via SSE using Groq LLM."""

    async def event_generator():
        async for chunk in stream_gap_analysis(
            cv_skills=request.cv_skills,
            job_skills=request.job_skills,
            missing_skills=request.missing_skills,
            matched_skills=request.matched_skills,
            job_description=request.job_description,
            score=request.score,
        ):
            yield chunk

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
