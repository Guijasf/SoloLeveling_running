from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime


class UserSettings(Base):
    """Configurações personalizadas do usuário"""
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Privacidade
    profile_visibility = Column(String, default="public")  # public, friends, private

    # Notificações
    notifications_enabled = Column(Boolean, default=True)
    weekly_report_enabled = Column(Boolean, default=True)

    # Aparência
    theme = Column(String, default="dark")  # dark, light
    language = Column(String, default="pt-BR")  # pt-BR, en-US

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    user = relationship("User", back_populates="settings")

