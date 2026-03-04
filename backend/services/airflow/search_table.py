from config import settings
from sqlalchemy import text

def search_table(table, db):
    # query = text("""
    #     SELECT table_name
    #     FROM all_tables
    #     WHERE owner = :owner
    #     AND table_name LIKE :table_name
    #     ORDER BY LENGTH(table_name), table_name
    # """)
    # result = db.execute(query, {"owner": "IBS", "table_name": f"%{table.upper()}%"})

    query= text("""
        select
            table_name
        from all_tables
        where owner = :owner
    """)
    result = db.execute(query, {"owner": "IBS", "table_name": f"%{table.upper()}%"})

    return [r[0] for r in result.fetchall()]
    