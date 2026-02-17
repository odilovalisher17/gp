from fastapi import FastAPI
from routers.airflow import router as airflow_router

app = FastAPI(title="My Production API")

app.include_router(airflow_router, prefix="/api/airflow", tags=["airflow"])
