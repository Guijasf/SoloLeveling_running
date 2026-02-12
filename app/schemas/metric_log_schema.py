from pydantic import BaseModel
from datetime import date


class MetricLogCreate(BaseModel):
    user_id: int
    metric_type_id: int
    value: float
    log_date: date


class MetricLogResponse(BaseModel):
    id: int
    user_id: int
    metric_type_id: int
    value: float
    log_date: date

    class Config:
        from_attributes = True
