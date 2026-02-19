# 🚀 CAMADA 2 — Inteligência do Sistema

## 📋 Visão Geral

Aqui transformamos o sistema de CRUD puro para **adaptativo e inteligente**. O sistema deixa de apenas registrar dados e passa a:

- 🎯 Detectar automaticamente a área mais fraca
- 📅 Gerar foco semanal automático com multiplicador de XP
- 🎮 Criar missões verdadeiramente dinâmicas (não templates fixos)
- 🏆 Sistema de conquistas/achievements
- 📊 Dificuldade adaptativa baseada no progresso

---

## 🔥 4. Foco Semanal Automático

### Objetivo
Sistema que identifica a área mais fraca e a **prioriza para toda a semana**, com recompensas aumentadas.

### Implementação

#### 4.1 Criar Modelo `UserFocus`
```python
# app/models/user_focus.py
from sqlalchemy import Column, Integer, ForeignKey, String, Date, Float
from app.core.database import Base

class UserFocus(Base):
    __tablename__ = "user_focus"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    area_name = Column(String)  # ex: "Health"
    score_when_focused = Column(Float)  # Score quando decidiu focar
    focus_start_date = Column(Date)
    focus_end_date = Column(Date)
    xp_multiplier = Column(Float, default=1.5)  # 50% a mais de XP
    
    # Contadores
    logs_completed = Column(Integer, default=0)
    improvement = Column(Float, default=0.0)  # Quanto melhorou em %
    
    user = relationship("User")
```

#### 4.2 Service de Foco Semanal
```python
# app/services/focus_service.py (expandir)
from datetime import date, timedelta
from app.models.user_focus import UserFocus

def generate_weekly_focus(db: Session, user_id: int):
    """
    Analisa scores semanais, detecta área mais fraca,
    cria ou atualiza foco semanal.
    """
    # 1. Calcular scores
    area_scores = calculate_area_scores(db, user_id)
    weakest = find_weakest_area(area_scores)
    
    if not weakest:
        return None
    
    # 2. Verificar se já existe foco ativo
    today = date.today()
    active_focus = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.focus_end_date >= today
    ).first()
    
    if active_focus:
        # Se área é a mesma, keep going
        if active_focus.area_name == weakest["area"]:
            return active_focus
        # Senão, cria novo foco
        active_focus.focus_end_date = today - timedelta(days=1)
    
    # 3. Criar novo foco para a próxima semana
    new_focus = UserFocus(
        user_id=user_id,
        area_name=weakest["area"],
        score_when_focused=weakest["score"],
        focus_start_date=today,
        focus_end_date=today + timedelta(days=7),
        xp_multiplier=1.5  # 50% bonus
    )
    db.add(new_focus)
    db.commit()
    db.refresh(new_focus)
    
    return new_focus

def get_xp_multiplier(db: Session, user_id: int, area: str) -> float:
    """
    Se o usuário está focando nesta área, retorna multiplicador.
    Senão, retorna 1.0 (sem modificação).
    """
    today = date.today()
    focus = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.area_name == area,
        UserFocus.focus_end_date >= today
    ).first()
    
    return focus.xp_multiplier if focus else 1.0
```

#### 4.3 Integração com Progress Engine
```python
# app/services/progress_engine.py (atualizar _calculate_xp_gain)

def _calculate_xp_gain(new_log, area_scores, progress, db=None, user_id=None):
    """
    Calcula XP ganho com multiplicador de foco.
    """
    if not new_log:
        if area_scores:
            avg_score = sum(a["score"] for a in area_scores) / len(area_scores)
            return max(1, int(avg_score * 0.3))
        return 5
    
    # XP base
    log_value = new_log.value if hasattr(new_log, 'value') else 0
    base_xp = max(1, int(log_value * 3))
    
    # ✨ NOVO: Multiplicador de foco
    multiplier = 1.0
    if db and user_id and hasattr(new_log, 'metric_type_id'):
        # Descobrir área deste log
        metric = db.query(MetricType).filter(
            MetricType.id == new_log.metric_type_id
        ).first()
        if metric:
            area = db.query(LifeArea).filter(
                LifeArea.id == metric.life_area_id
            ).first()
            if area:
                from app.services.focus_service import get_xp_multiplier
                multiplier = get_xp_multiplier(db, user_id, area.name)
    
    return int(base_xp * multiplier)


# E no progress_engine.py, chamar com contexto:
def process_user_progress(db: Session, user_id: int, new_log=None):
    # ... código anterior ...
    
    # XP com contexto completo (foco incluído)
    xp_gain = _calculate_xp_gain(new_log, area_scores, progress, db, user_id)
    
    # ...rest of code
```

#### 4.4 Endpoint de Foco
```python
# app/routers/focus_router.py (novo)
from fastapi import APIRouter, Depends
from app.services.focus_service import generate_weekly_focus

@router.get("/focus/{user_id}")
def get_weekly_focus(user_id: int, db: Session = Depends(get_db)):
    """Gera ou retorna foco semanal do usuário"""
    focus = generate_weekly_focus(db, user_id)
    
    if not focus:
        return {"message": "Nenhum foco definido ainda"}
    
    return {
        "area": focus.area_name,
        "starts": focus.focus_start_date,
        "ends": focus.focus_end_date,
        "xp_multiplier": focus.xp_multiplier,
        "initial_score": focus.score_when_focused,
        "logs_completed": focus.logs_completed
    }
```

**Checklist:**
- [ ] Criar modelo `UserFocus`
- [ ] Expandir `focus_service.py` com `generate_weekly_focus()` e `get_xp_multiplier()`
- [ ] Atualizar `progress_engine.py` para receber `db` e `user_id` e aplicar multiplicador
- [ ] Criar router de foco (`focus_router.py`)
- [ ] Testar que XP é multiplicado quando focando numa área

---

## 🔥 5. Missões Realmente Dinâmicas

### Objetivo
Gerar missões baseadas em **contexto real do usuário**, não templates fixos.

### Estado Atual (Problema)
```python
# Hoje: templates hardcoded
templates = [
    f"Dedique 30 minutos para melhorar {area_name}",
    f"Estude algo novo em {area_name}",
    f"Execute uma ação prática em {area_name}"
]
```

### Solução: Missões Contextuais

#### 5.1 Sistema de Geração Dinâmica
```python
# app/services/mission_service.py (refatorar)

def generate_daily_missions(db: Session, user_id: int, context: dict):
    """
    Gera missões baseadas em contexto real:
    - Score atual da área
    - Tendência (growing/declining/stable)
    - Streak do usuário
    - Rank atual
    - Foco semanal
    
    Args:
        context = {
            "area": "Health",
            "score": 5.0,
            "trend": "declining",
            "current_rank": "C",
            "streak": 3,
            "is_focused_area": True
        }
    """
    missions = []
    area = context["area"]
    score = context["score"]
    trend = context["trend"]
    is_focused = context.get("is_focused_area", False)
    
    # Dinâmica 1: Score baixo → missões mais simples
    if score < 3:
        difficulty = "easy"
        xp_reward = 30
        goal_value = 2.0
    elif score < 6:
        difficulty = "medium"
        xp_reward = 50
        goal_value = 5.0
    else:
        difficulty = "hard"
        xp_reward = 75
        goal_value = 8.0
    
    # Dinâmica 2: Tendência declínio → urgência alta
    if trend == "declining":
        urgency = "high"
        title_prefix = "URGENTE:"
    elif trend == "stable":
        urgency = "normal"
        title_prefix = ""
    else:  # growing
        urgency = "low"
        title_prefix = "BÔNUS:"
    
    # Dinâmica 3: Foco semanal → mais missões desta área
    mission_count = 5 if is_focused else 3
    
    # Dinâmica 4: Gerar missões baseadas em contexto
    mission_templates = _get_dynamic_missions(
        area, difficulty, trend, is_focused
    )
    
    for i, template in enumerate(mission_templates[:mission_count]):
        mission = DailyMission(
            user_id=user_id,
            title=f"{title_prefix} {template['title']}".strip(),
            xp_reward=xp_reward + (i * 5),  # Aumenta ligeiramente por missão
            difficulty=difficulty,
            target_metric_value=template.get("target_value", goal_value),
            mission_date=date.today()
        )
        db.add(mission)
        missions.append(mission)
    
    db.commit()
    return missions


def _get_dynamic_missions(area: str, difficulty: str, trend: str, is_focused: bool):
    """
    Retorna templates de missão baseado em contexto.
    """
    missions = {
        "Health": {
            "easy": [
                {"title": "Caminhe 15 minutos hoje", "target_value": 3.0},
                {"title": "Beba 2 litros de água", "target_value": 2.5},
                {"title": "Durma 7+ horas", "target_value": 2.0},
            ],
            "medium": [
                {"title": "40 minutos de exercício", "target_value": 5.0},
                {"title": "Prepare refeição saudável", "target_value": 4.5},
                {"title": "Faça alongamento 20min", "target_value": 5.0},
            ],
            "hard": [
                {"title": "60min de exercício intenso", "target_value": 8.0},
                {"title": "Crie plano alimentar semanal", "target_value": 8.5},
                {"title": "Treine novo exercício", "target_value": 9.0},
            ]
        },
        "Career": {
            "easy": [
                {"title": "Leia 20min sobre sua área", "target_value": 3.0},
                {"title": "Pratique uma skill básica", "target_value": 2.5},
            ],
            "medium": [
                {"title": "Complete curso online (1h)", "target_value": 5.0},
                {"title": "Trabalhe em projeto pessoal", "target_value": 5.5},
            ],
            "hard": [
                {"title": "Completa 2 cursos online", "target_value": 8.0},
                {"title": "Crie portfólio project", "target_value": 9.0},
            ]
        },
        # ... similar para Finance, Relationships, Mind
    }
    
    return missions.get(area, {}).get(difficulty, [])
```

#### 5.2 Atualizar DailyMission Model
```python
# app/models/daily_mission.py (adicionar campos)
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Float

class DailyMission(Base):
    # ... existing fields ...
    
    # NOVO: Campos para dinâmica
    difficulty = Column(String, default="medium")  # easy/medium/hard
    target_metric_value = Column(Float)  # Valor esperado para completar
    completed_value = Column(Float, nullable=True)  # Valor alcançado
    
    def is_completed(self):
        if not self.target_metric_value or not self.completed_value:
            return self.completed
        return self.completed_value >= self.target_metric_value
```

#### 5.3 Integração com Progress Engine
```python
# No progress_engine.py:

def process_user_progress(db: Session, user_id: int, new_log=None):
    """Chamar generate_daily_missions com contexto"""
    
    # ... código anterior ...
    
    # Gerar missões dinâmicas para hoje
    _update_daily_missions(db, user_id, area_scores, progress)


def _update_daily_missions(db, user_id, area_scores, progress):
    """Gera missões dinâmicas baseadas em contexto real"""
    today = date.today()
    
    # Verificar se já existem missões de hoje
    existing = db.query(DailyMission).filter(
        DailyMission.user_id == user_id,
        DailyMission.mission_date == today
    ).first()
    
    if existing:
        return  # Já existem, não regenerar
    
    # Coletar contexto
    weakest = find_weakest_area(area_scores)
    trend = calculate_trend(db, user_id)
    focus = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.focus_end_date >= today
    ).first()
    
    context = {
        "area": weakest["area"] if weakest else "vida",
        "score": weakest["score"] if weakest else 0,
        "trend": trend,
        "current_rank": progress.rank,
        "streak": progress.current_streak,
        "is_focused_area": (focus and focus.area_name == weakest["area"]) if weakest else False
    }
    
    # Gerar com contexto
    from app.services.mission_service import generate_daily_missions
    generate_daily_missions(db, user_id, context)
```

**Checklist:**
- [ ] Atualizar `DailyMission` model com `difficulty`, `target_metric_value`
- [ ] Refatorar `mission_service.py` com `generate_daily_missions()` e `_get_dynamic_missions()`
- [ ] Implementar `_update_daily_missions()` na engine
- [ ] Testar que missões variam baseado em contexto

---

## 🔥 6. Sistema de Conquistas (Achievements)

### Objetivo
Recompensar milestones e criar engajamento contínuo.

#### 6.1 Criar Modelo Achievement
```python
# app/models/achievement.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from datetime import datetime

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Tipo de achievement
    achievement_type = Column(String)  # ex: "streak_7", "rank_b", "xp_1000"
    title = Column(String)
    description = Column(String)
    icon = Column(String)  # emoji ou URL
    
    # Metadata
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    xp_reward = Column(Integer, default=100)
    
    user = relationship("User")
```

#### 6.2 Service de Achievements
```python
# app/services/achievement_service.py (novo)

ACHIEVEMENTS = {
    "streak_3": {
        "title": "Consistência",
        "description": "Mantenha um streak de 3 dias",
        "icon": "🔥",
        "xp_reward": 50
    },
    "streak_7": {
        "title": "Uma Semana Completa",
        "description": "Mantenha um streak de 7 dias",
        "icon": "🌟",
        "xp_reward": 100
    },
    "streak_30": {
        "title": "Lendário",
        "description": "Mantenha um streak de 30 dias",
        "icon": "👑",
        "xp_reward": 500
    },
    "rank_b": {
        "title": "Classe B",
        "description": "Suba para rank B",
        "icon": "⬆️",
        "xp_reward": 200
    },
    "rank_a": {
        "title": "Classe A",
        "description": "Suba para rank A",
        "icon": "⬆️⬆️",
        "xp_reward": 400
    },
    "xp_1000": {
        "title": "Coletor de XP",
        "description": "Acumule 1000 XP",
        "icon": "💎",
        "xp_reward": 150
    },
    "area_mastery_health": {
        "title": "Mestre da Saúde",
        "description": "Atinja score 9+ em Health por 2 semanas",
        "icon": "💪",
        "xp_reward": 300
    }
}

def check_and_unlock_achievements(db: Session, user_id: int, progress):
    """
    Verifica se usuário desbloqueou novos achievements.
    Retorna lista de novos achievements.
    """
    new_achievements = []
    
    # Verificar cada achievement
    if progress.current_streak >= 3:
        ach = _unlock_achievement(db, user_id, "streak_3")
        if ach: new_achievements.append(ach)
    
    if progress.current_streak >= 7:
        ach = _unlock_achievement(db, user_id, "streak_7")
        if ach: new_achievements.append(ach)
    
    if progress.current_streak >= 30:
        ach = _unlock_achievement(db, user_id, "streak_30")
        if ach: new_achievements.append(ach)
    
    if progress.rank == "B":
        ach = _unlock_achievement(db, user_id, "rank_b")
        if ach: new_achievements.append(ach)
    
    if progress.xp >= 1000:
        ach = _unlock_achievement(db, user_id, "xp_1000")
        if ach: new_achievements.append(ach)
    
    return new_achievements

def _unlock_achievement(db: Session, user_id: int, achievement_type: str):
    """Desbloqueia achievement se não foi desbloqueado"""
    # Verificar se já foi desbloqueado
    existing = db.query(Achievement).filter(
        Achievement.user_id == user_id,
        Achievement.achievement_type == achievement_type
    ).first()
    
    if existing:
        return None  # Já desbloqueado
    
    # Criar novo achievement
    ach_data = ACHIEVEMENTS[achievement_type]
    achievement = Achievement(
        user_id=user_id,
        achievement_type=achievement_type,
        title=ach_data["title"],
        description=ach_data["description"],
        icon=ach_data["icon"],
        xp_reward=ach_data["xp_reward"]
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    
    return achievement
```

#### 6.3 Integração com Engine
```python
# No progress_engine.py:

def process_user_progress(db: Session, user_id: int, new_log=None):
    # ... código anterior ...
    
    # Verificar achievements
    new_achievements = check_and_unlock_achievements(db, user_id, progress)
    achievement_bonus = len(new_achievements) * 50  # 50 XP por achievement
    progress.xp += achievement_bonus
    
    # ...rest of code
    
    return {
        # ... campos anteriores ...
        "new_achievements": [
            {
                "title": ach.title,
                "icon": ach.icon,
                "xp_reward": ach.xp_reward
            }
            for ach in new_achievements
        ],
        "achievement_bonus": achievement_bonus
    }
```

**Checklist:**
- [ ] Criar modelo `Achievement`
- [ ] Implementar `achievement_service.py`
- [ ] Integrar `check_and_unlock_achievements()` na engine
- [ ] Testar que achievements são desbloqueados corretamente

---

## 🔥 7. Dificuldade Adaptativa

### Objetivo
Sistema que se adapta ao progresso do usuário automaticamente.

```python
# app/services/difficulty_service.py (novo)

def calculate_adaptive_difficulty(db: Session, user_id: int):
    """
    Analisa progresso e retorna ajustes dinâmicos.
    """
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == user_id
    ).first()
    
    # Velocidade de progresso (XP por dia)
    xp_per_day = progress.xp / (progress.days_active + 1)
    
    if xp_per_day > 100:  # Muito rápido
        return {
            "difficulty_multiplier": 1.2,  # Missões 20% mais difíceis
            "xp_needed_for_level": 1.1,   # 10% mais XP necessário
            "suggestion": "Você está evoluindo rápido! Desafios aumentaram."
        }
    elif xp_per_day > 50:
        return {
            "difficulty_multiplier": 1.0,
            "xp_needed_for_level": 1.0,
            "suggestion": "Ritmo saudável. Continue assim!"
        }
    else:  # Lento
        return {
            "difficulty_multiplier": 0.8,  # Missões 20% mais fáceis
            "xp_needed_for_level": 0.9,   # 10% menos XP necessário
            "mission_reward_bonus": 1.2,   # 20% mais XP por missão
            "suggestion": "Reduzi a dificuldade para você. Bora pegar ritmo!"
        }
```

---

## 📋 Resumo - Ordem de Implementação

1. ✅ **CAMADA 1** (Já feito): Engine estável
2. 🔄 **CAMADA 2** (Próximo):
   - [ ] Foco semanal com multiplicador de XP
   - [ ] Missões dinâmicas baseadas em contexto
   - [ ] Sistema de achievements
   - [ ] Dificuldade adaptativa

3. ⏳ **CAMADA 3**: Histórico temporal + Dashboard consolidado
4. ⏳ **CAMADA 4**: Auth real + Temporadas + Leaderboard

---

## 🧪 Testes para CAMADA 2

Cada funcionalidade deve ter testes que validem:

- [ ] Foco é gerado automaticamente
- [ ] Multiplicador de XP é aplicado
- [ ] Missões variam baseadas em context
- [ ] Achievements são desbloqueados
- [ ] Dificuldade se adapta ao ritmo do usuário

---

## 🎯 Próximos Passos

1. Iniciar implementação do Foco Semanal
2. Testar integração com engine
3. Implementar Missões Dinâmicas
4. Adicionar Achievements
5. Implementar Dificuldade Adaptativa

**Estimativa**: 2-3 dias de desenvolvimento (dependendo do ritmo)


