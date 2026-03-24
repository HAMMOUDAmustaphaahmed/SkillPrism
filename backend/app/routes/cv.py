import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.pdf_parser import parse_file
from app.services.skills_extractor import extract_skills
from app.models.schemas import ParsedCV
from app.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/cv", tags=["CV"])


@router.post("/parse", response_model=ParsedCV)
async def parse_cv(file: UploadFile = File(...)):
    """Upload a CV (PDF, DOCX, TXT) and extract skills."""
    settings = get_settings()

    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    allowed_types = {
        "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain", "application/octet-stream"
    }
    allowed_extensions = {".pdf", ".docx", ".txt"}

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Please upload PDF, DOCX, or TXT."
        )

    file_bytes = await file.read()

    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE_MB}MB."
        )

    text = parse_file(file_bytes, file.filename)

    if not text or len(text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Could not extract meaningful text from the file. Please ensure it's not scanned/image-only."
        )

    skills, skills_by_category = extract_skills(text)

    if not skills:
        logger.warning(f"No skills found in CV: {file.filename}")

    return ParsedCV(
        raw_text=text[:5000],
        skills=skills,
        skills_by_category=skills_by_category,
        word_count=len(text.split()),
    )
