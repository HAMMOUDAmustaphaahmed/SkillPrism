from typing import List, Dict, Tuple
from app.services.skills_extractor import SKILLS_DB


MATCH_LABELS = [
    (90, "Excellent Match", "#10B981"),
    (75, "Strong Match", "#34D399"),
    (60, "Good Match", "#F59E0B"),
    (40, "Partial Match", "#F97316"),
    (0,  "Low Match", "#F43F5E"),
]


def get_match_label(score: int) -> Tuple[str, str]:
    for threshold, label, color in MATCH_LABELS:
        if score >= threshold:
            return label, color
    return "Low Match", "#F43F5E"


def calculate_match(cv_skills: List[str], job_skills: List[str]) -> Dict:
    """
    Calculate match between CV skills and job skills.
    Returns score, matched/missing skills breakdown.
    """
    cv_lower = {s.lower(): s for s in cv_skills}
    job_lower = {s.lower(): s for s in job_skills}

    matched = []
    missing = []

    for skill_lower, skill in job_lower.items():
        if skill_lower in cv_lower:
            matched.append(skill)
        else:
            missing.append(skill)

    cv_only = [s for sl, s in cv_lower.items() if sl not in job_lower]

    total_job = max(len(job_skills), 1)
    raw_score = int((len(matched) / total_job) * 100)

    bonus = min(10, len(cv_only) // 3)
    score = min(100, raw_score + bonus)

    label, color = get_match_label(score)

    by_category: Dict[str, List[str]] = {}
    all_relevant = matched + missing
    for skill in all_relevant:
        for category, skills_list in SKILLS_DB.items():
            if skill in skills_list:
                by_category.setdefault(category, []).append(skill)
                break

    return {
        "score": score,
        "matched_skills": matched,
        "missing_skills": missing,
        "cv_only_skills": cv_only,
        "skills_by_category": by_category,
        "label": label,
        "color": color,
    }
