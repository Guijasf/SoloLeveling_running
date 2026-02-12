from pydantic import BaseModel

class LifeAreaCreate(BaseModel):
    name: str
    weight: float

class LifeAreaResponse(BaseModel):
    id: int
    name: str
    weight: float

    class Config:
        from_attributes = True