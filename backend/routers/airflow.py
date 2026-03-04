from fastapi import APIRouter, HTTPException, Depends
from schemas.airflow_schema import Dag
from db.oracle_db import OracleSession
from sqlalchemy.orm import Session
from db.deps import get_db, get_greenplum
from services.airflow.create_dag import create_dag
from services.airflow.search_table import search_table
from services.airflow.initial_ddl import initial_ddl
from config_manager import get_config_manager, YamlConfigManager

router = APIRouter()

@router.post("/dag/create")
def create_dag_route(request: Dag, manager: YamlConfigManager = Depends(get_config_manager), gp_db: Session = Depends(get_greenplum)):
    return create_dag(request, manager, gp_db)

@router.get("/dag/create/all-tables")
def search_table_route(table: str, db: Session = Depends(get_db)):
    return search_table(table, db=db)

@router.get("/dag/create/initial-ddl")
def initial_ddl_route(owner: str, table: str, db: Session = Depends(get_db)):
    return initial_ddl(table, owner, db=db)

# @router.get("/{item_id}", response_model=ItemResponse)
# def get_item(item_id: int):
#     item = ItemService.get_item(item_id)
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return item
