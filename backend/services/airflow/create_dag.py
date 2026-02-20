from config import settings

def create_dag(req):
    print(req.dict())
    return settings.DAG_FOLDER