# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DAG_FOLDER: str
    DATABASE_HOST: str
    DATABASE_PORT: int
    DATABASE_USER: str
    DATABASE_PASSWORD: str
    DATABASE_SERVICE: str
    GP_HOST: str
    GP_PORT: int
    GP_USER: str
    GP_PASSWORD: str
    GP_DATABASE: str

    model_config = {"env_file": ".env"}

settings = Settings()
