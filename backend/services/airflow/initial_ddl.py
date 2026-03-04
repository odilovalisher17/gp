from sqlalchemy import text

def initial_ddl(table, owner, db):
    query = text("""
        SELECT
            column_id,
            column_name,
            data_type,
            data_length,
            data_precision,
            data_scale,
            nullable
        FROM all_tab_columns
        WHERE owner = :owner
        AND table_name = :table_name
        ORDER BY column_id
    """)

    result = db.execute(
        query,
        {
            "owner": "IBS",
            "table_name": table.upper()
        }
    )
    data = result.mappings().all()

    suggested_types = {
        "NUMBER": "NUMERIC",
        "VARCHAR2": "VARCHAR",
        "DATE": "DATE"
    }

    res = {
        "ddl": [],
        "suggested_ddl": []
    }

    for row in data:
        row_dict = dict(row)
        res["ddl"].append(row_dict)
        updated_row = row_dict.copy()

        updated_row["data_type"] = suggested_types.get(
            row_dict["data_type"],
            row_dict["data_type"]
        )

        res["suggested_ddl"].append(updated_row)

    return res