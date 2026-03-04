from config import settings
from fastapi.responses import JSONResponse
from sqlalchemy import text
import traceback

def create_dag(req, manager, gp_db):
    try:
        new_table = req.dict()
        # print(req.dict())
        # print(generate_create_table(
        #         new_table['target_schema'], 
        #         new_table['target_table'], 
        #         new_table['ddl'], 
        #         new_table['primary_keys'], 
        #         new_table['distribution_keys'],
        #         new_table['partition'],
        #         new_table['partition_details'],
        #         new_table['with_config']
        #     )
        # )
        if not new_table['target_table_created']:
            gp_db.execute(
                text(generate_create_table(
                    new_table['target_schema'], 
                    new_table['target_table'], 
                    new_table['ddl'], 
                    new_table['primary_keys'], 
                    new_table['distribution_keys'],
                    new_table['partition'],
                    new_table['partition_details'],
                    new_table['with_config']
                ))
            )
            gp_db.commit()

        for idx, col in enumerate(new_table["ddl"]):
            del col['data_type']
            del col['data_length']
            del col['data_precision']
            del col['data_scale']
            del col['nullable']
            # data_type: NUMERIC
            # data_length: 22
            # data_precision: 10
            # data_scale: 0
            # nullable: N
            col["source_col"] = new_table["source_ddl"][idx]["column_name"]
        
        del new_table["target_table_created"]
        del new_table["source_ddl"]
        # del new_table["backfilling"]
        del new_table["primary_keys"]
        del new_table["distribution_keys"]
        del new_table["partition"]
        del new_table["partition_details"]
        del new_table["with_config"]
        # manager.delete_table("ibs","ln_graph_debt")
        # manager.delete_table("ibs","saldo")
        manager.add_table(new_table)
        manager.save()
        return {
            "message" : "Success"
        }
    except Exception as e:
        print(e)
        traceback.print_exc()
        return JSONResponse(status_code=400, content={"detail": str(e)})


def generate_create_table(schema_name,table_name, columns, primary_keys, distribution_keys, partition, partition_details, with_config):
    column_defs = []

    for col in columns:
        name = col["column_name"]
        nullable = col.get("nullable", "Y")
        data_type = col["data_type"].upper()

        if data_type in ["NUMERIC", "DECIMAL"]:
            precision = col.get("data_precision")
            scale = col.get("data_scale", 0)
            if precision:
                data_type_str = f"{data_type}({precision},{scale})"
            else:
                data_type_str = data_type
        elif data_type in ["VARCHAR", "CHAR"]:
            length = col.get("data_length", 255)
            data_type_str = f"{data_type}({length})"
        else:
            data_type_str = data_type

        null_str = "" if nullable == "Y" else "NOT NULL"
        column_defs.append(f"{name} {data_type_str} {null_str}".strip())

    if partition:
        partition_sql = f"PARTITION BY RANGE({partition_details['key']})\n(START ('{partition_details['start']}') END('{partition_details['end']}') EVERY(INTERVAL '{partition_details['interval']}'))"

    if with_config['appendoptimized']:
        with_config_sql = f"""
            WITH (
                appendoptimized = {with_config['appendoptimized']},
                orientation = {with_config['orientation']},
                compresstype = {with_config['compresstype']},
                compresslevel = {with_config['compresslevel']}
            )
        """

    columns_sql = ",\n  ".join(column_defs)
    create_sql = f"""
        CREATE TABLE {schema_name}.{table_name} (
            {columns_sql},
            PRIMARY KEY({','.join(primary_keys)})
        )
        {with_config_sql if with_config['appendoptimized'] else ''}
        DISTRIBUTED BY ({','.join(distribution_keys)})
        {partition_sql if partition else ''}
    """
    return create_sql
