"""
Router de Autenticação - Login, Registro, /me
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.user_progress import UserProgress
from app.models.user_settings import UserSettings
from app.schemas.auth_schema import LoginRequest, TokenResponse, UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    🆕 Registro de novo usuário
    - Cria usuário com senha hasheada
    - Cria progress automaticamente
    - Retorna JWT
    """
    # Verifica se email já existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )

    # Hash da senha
    hashed_password = hash_password(user_data.password)

    # Cria usuário
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Cria progress automaticamente
    progress = UserProgress(user_id=new_user.id, xp=0, level=1)
    db.add(progress)
    db.commit()

    # Cria settings padrão
    settings = UserSettings(user_id=new_user.id)
    db.add(settings)
    db.commit()

    # Gera token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    🔐 Login de usuário existente
    - Valida email e senha
    - Retorna JWT
    """
    # Busca usuário
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    # Verifica senha
    if not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )

    # Gera token
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    👤 Retorna dados do usuário autenticado
    - Protegido por JWT
    - Usado para validar sessão no frontend
    """
    return current_user





