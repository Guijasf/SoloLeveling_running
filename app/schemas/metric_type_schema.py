from pydantic import BaseModel


class MetricTypeCreate(BaseModel):
    name: str
    unit: str
    life_area_id: int


class MetricTypeResponse(BaseModel):
    id: int
    name: str
    unit: str
    life_area_id: int

    class Config:
        from_attributes = True
