from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from app.core.database import Base


class MetricLog(Base):
    __tablename__ = "metric_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    metric_type_id = Column(Integer, ForeignKey("metric_types.id"))

    value = Column(Float, nullable=False)
    log_date = Column(Date, nullable=False)
