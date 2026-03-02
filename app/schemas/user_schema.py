from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class UserDashboardResponse(BaseModel):
    """User data with progress info for dashboard display"""
    id: int
    name: str
    email: str
    level: int = 1
    username: str = ""
    xp: int = 0
    current_xp: int = 0
    next_level_xp: int = 2700
    
    class Config:
        from_attributes = True
