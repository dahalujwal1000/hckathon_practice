from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    KIMI_API_KEY: str
    KIMI_BASE_URL: str = "https://api.moonshot.cn/v1"
    KIMI_MODEL: str = "moonshot-v1-8k"
    NESTJS_INTERNAL_TOKEN: str
    FAISS_INDEX_PATH: str = "./vectorstore/faiss_index"
    PORT: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

@lru_cache
def get_settings() -> Settings:
    return Settings()