from pydantic import BaseModel

class GoalCreate(BaseModel):
    title: str
    user_id: int

class GoalResponse(BaseModel):
    id: int
    title: str
    completed: bool
    user_id: int

    class Config:
        from_attributes = True
