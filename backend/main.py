from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.airflow import router as airflow_router
from config_manager import YamlConfigManager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(airflow_router, prefix="/api/airflow", tags=["airflow"])
