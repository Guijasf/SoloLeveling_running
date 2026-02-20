from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Schema para login"""
    email: str
    password: str


class TokenResponse(BaseModel):
    """Schema para resposta de autenticação"""
    access_token: str
    token_type: str
    user: dict


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

