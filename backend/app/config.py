from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    ALLOWED_ORIGINS: str = "http://localhost:5173,https://skillprism.vercel.app"
    GROQ_MODEL: str = "llama3-70b-8192"
    MAX_FILE_SIZE_MB: int = 5

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
