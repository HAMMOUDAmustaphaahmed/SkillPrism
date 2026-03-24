import json
import logging
from typing import List, AsyncGenerator
from app.config import get_settings

logger = logging.getLogger(__name__)


def build_gap_analysis_prompt(
    cv_skills: List[str],
    job_skills: List[str],
    missing_skills: List[str],
    matched_skills: List[str],
    job_description: str,
    score: int,
) -> str:
    cv_skills_str = ", ".join(cv_skills[:40]) if cv_skills else "None detected"
    job_skills_str = ", ".join(job_skills[:30]) if job_skills else "Not specified"
    missing_str = ", ".join(missing_skills[:20]) if missing_skills else "None — perfect match!"
    matched_str = ", ".join(matched_skills[:20]) if matched_skills else "None"
    job_preview = job_description[:800] if len(job_description) > 800 else job_description

    return f"""You are an expert career coach and senior technical recruiter with 15 years of experience.

**Candidate Profile:**
- Skills detected in CV: {cv_skills_str}
- Match score with target role: {score}/100

**Target Role Analysis:**
- Required skills found: {job_skills_str}
- Skills candidate already has: {matched_str}
- Skills gap (missing): {missing_str}

**Job Description Preview:**
{job_preview}

---

Provide a comprehensive, personalized gap analysis using the following structure:

## Overall Assessment
Write 2-3 sentences evaluating this match. Be honest but encouraging. Mention the score context.

## Strengths You Bring
List 3-5 key strengths the candidate already has that are relevant to this role. Be specific.

## Critical Skills to Develop
For each of the top 3-5 missing skills, provide:
- **[Skill Name]**: Why it matters for this role + the fastest learning path (specific course/resource + estimated time)

## 30-60-90 Day Action Plan
- **Month 1**: Foundation (what to learn/do first)
- **Month 2**: Depth (deepening knowledge)
- **Month 3**: Portfolio (what to build/demonstrate)

## Pro Tips
Give 2-3 tactical tips specific to this type of role — how to present existing skills, what to highlight in applications, or how to frame experience gaps positively.

Use markdown formatting. Be specific, actionable, and encouraging. Focus on what's achievable."""


async def stream_gap_analysis(
    cv_skills: List[str],
    job_skills: List[str],
    missing_skills: List[str],
    matched_skills: List[str],
    job_description: str,
    score: int,
) -> AsyncGenerator[str, None]:
    """Stream gap analysis from Groq API."""
    settings = get_settings()

    if not settings.GROQ_API_KEY:
        yield "data: " + json.dumps({"text": "⚠️ Groq API key not configured. Please add GROQ_API_KEY to your environment variables.", "done": False}) + "\n\n"
        yield "data: " + json.dumps({"done": True}) + "\n\n"
        return

    try:
        from groq import AsyncGroq

        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        prompt = build_gap_analysis_prompt(
            cv_skills, job_skills, missing_skills,
            matched_skills, job_description, score
        )

        stream = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert career coach. Provide specific, actionable advice in a warm, professional tone. Use markdown formatting."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7,
            stream=True,
        )

        async for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield "data: " + json.dumps({"text": delta.content, "done": False}) + "\n\n"

        yield "data: " + json.dumps({"done": True}) + "\n\n"

    except Exception as e:
        logger.error(f"Groq streaming error: {e}")
        error_msg = str(e)
        if "rate_limit" in error_msg.lower():
            msg = "⚠️ Rate limit reached. Please wait a moment and try again."
        elif "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
            msg = "⚠️ Invalid API key. Please check your GROQ_API_KEY configuration."
        else:
            msg = f"⚠️ Analysis service temporarily unavailable. Error: {error_msg}"

        yield "data: " + json.dumps({"text": msg, "done": False}) + "\n\n"
        yield "data: " + json.dumps({"done": True}) + "\n\n"
