# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DAG_FOLDER: str

    model_config = {"env_file": ".env"}

settings = Settings()
