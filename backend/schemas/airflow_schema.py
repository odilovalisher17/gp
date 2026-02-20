from pydantic import BaseModel

class Dag(BaseModel):
    source_db: str
    source_schema: str
    source_table: str
    target_schema: str
    target_table: str
    has_created: bool
    ddl: list
    update_type: str
    key: str
    backfilling: bool
    chunk_size: int

