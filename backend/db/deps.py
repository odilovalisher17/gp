from db.oracle_db import OracleSession
from db.gp_db import GreenplumSession

def get_db():
    db = OracleSession()
    try:
        yield db
    finally:
        db.close()

def get_greenplum():
    db = GreenplumSession()
    try:
        yield db
    finally:
        db.close()