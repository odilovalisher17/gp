from pydantic import BaseModel

class Dag(BaseModel):
    source_db: str
    source_schema: str
    source_table: str
    target_schema: str
    target_table: str
    source_ddl: list
    update_type: str
    key_column: str
    chunk_size: int
    backfilling: bool
    target_table_created: bool
    ddl: list
    primary_keys: list
    distribution_keys: list
    partition: bool
    partition_details: dict
    with_config: dict
    conflict_action: str
    conflict_cols: list
    conflict_set: list
