from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.database import engine, Base

# Importar modelos para registrar no Base.metadata
from app.models.goal_adaptive import AdaptiveGoal, GoalRegistry, GoalAchievement

from app.routers import user_router, scoring_router, life_area_router, metric_type_router, metric_log_router, mission_router
from app.routers.adaptive_goals_router import router as adaptive_goals_router
from app.routers.focus_router import router as focus_router
from app.routers.achievement_router import router as achievement_router
from app.routers.auth_router import router as auth_router
from app.routers.dashboard_router import router as dashboard_router
from app.routers.profile_router import router as profile_router
from app.routers.history_router import router as history_router
from app.routers.notification_router import router as notification_router
from app.routers.streak_router import router as streak_router
from app.routers.public_router import router as public_router
# Insights router será importado abaixo com os demais

app = FastAPI(title="SoloLeveling - RPG de Vida Real", version="3.0.0")

# CORS para permitir frontend acessar backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 Servir arquivos estáticos (HTML, CSS, JS)
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend-react", "public")
if os.path.exists(frontend_path):
    app.mount("/frontend", StaticFiles(directory=frontend_path), name="frontend")

Base.metadata.create_all(bind=engine)

# 🔐 Auth Router (SEMPRE PRIMEIRO)
app.include_router(auth_router)

# 🌐 Public API (SEM AUTENTICAÇÃO - para dashboard)
app.include_router(public_router)

# 📊 Dashboard consolidado (PROTEGIDO)
app.include_router(dashboard_router)

# 👤 Perfil e Estatísticas
app.include_router(profile_router)

# 📜 Histórico de eventos
app.include_router(history_router)

# 🔔 Notificações
app.include_router(notification_router)

# 🔥 Streak e Sequências
app.include_router(streak_router)

# 📊 Insights e Performance
from app.routers.insights_router import router as insights_router
app.include_router(insights_router)

# 🎯 Metas Adaptáveis
app.include_router(adaptive_goals_router)

# Demais routers
app.include_router(user_router.router)
app.include_router(life_area_router.router, prefix="/life-areas", tags=["Life Areas"])
app.include_router(metric_type_router.router)
app.include_router(metric_log_router.router)
app.include_router(scoring_router.router)
app.include_router(mission_router.router)
app.include_router(focus_router)
app.include_router(achievement_router)


@app.get("/")
def root():
    return {"message": "🎮 SoloLeveling - RPG de Vida Real", "status": "✅ Online"}
