from fastapi import APIRouter, HTTPException
from schemas.airflow_schema import Dag
from services.airflow.create_dag import create_dag

router = APIRouter()

@router.post("/dag/create")
def create_item(request: Dag):
    return create_dag(request)

# @router.get("/{item_id}", response_model=ItemResponse)
# def get_item(item_id: int):
#     item = ItemService.get_item(item_id)
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return item
