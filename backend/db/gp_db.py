from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import settings
from urllib.parse import quote

DATABASE_URL = (
    f"postgresql+psycopg2://{settings.GP_USER}:"
    f"{quote(settings.GP_PASSWORD)}@"
    f"{settings.GP_HOST}:"
    f"{settings.GP_PORT}/"
    f"{settings.GP_DATABASE}"
)

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True
)

GreenplumSession = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)