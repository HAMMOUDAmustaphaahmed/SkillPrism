from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import health, cv, jobs

settings = get_settings()

app = FastAPI(
    title="SkillPrism API",
    description="Refract your potential. Land your role.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(cv.router)
app.include_router(jobs.router)


@app.on_event("startup")
async def startup_event():
    print("🔮 SkillPrism API started successfully")
    print(f"   Allowed origins: {settings.origins_list}")
    print(f"   Groq model: {settings.GROQ_MODEL}")
    print(f"   API key configured: {'✓' if settings.GROQ_API_KEY else '✗'}")
