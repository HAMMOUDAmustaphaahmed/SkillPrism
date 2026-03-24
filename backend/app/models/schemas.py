from pydantic import BaseModel
from typing import List, Optional, Dict


class SkillCategory(BaseModel):
    name: str
    skills: List[str]


class ParsedCV(BaseModel):
    raw_text: str
    skills: List[str]
    skills_by_category: Dict[str, List[str]]
    word_count: int


class MatchRequest(BaseModel):
    cv_text: str
    job_description: str


class MatchResult(BaseModel):
    score: int
    matched_skills: List[str]
    missing_skills: List[str]
    cv_skills: List[str]
    job_skills: List[str]
    skills_by_category: Dict[str, List[str]]
    label: str
    color: str


class StreamRequest(BaseModel):
    cv_skills: List[str]
    job_skills: List[str]
    missing_skills: List[str]
    matched_skills: List[str]
    job_description: str
    score: int


class HealthResponse(BaseModel):
    status: str
    message: str
