from pydantic import BaseModel

class Dag(BaseModel):
    name: str
    price: float

