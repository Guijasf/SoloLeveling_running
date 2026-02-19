# ⚡ Guia Rápido de Desenvolvimento - SoloLeveling

Referência rápida para trabalhar com SoloLeveling sem se perder.

---

## 🎯 Princípio Central

> **Toda mudança no progresso do usuário passa por `progress_engine.py`**

Se você está:
- ✅ Adicionando nova feature de progresso → Modifique a engine
- ✅ Adicionando novo tipo de XP bonus → Modifique a engine
- ✅ Criando novo endpoint → Chame a engine se afeta progresso
- ❌ Criando novo router que manipula XP/Level/Rank → Problema!

---

## 🏗️ Como Adicionar Uma Feature (Exemplo: Foco Semanal)

### Passo 1: Criar o Modelo (BD)

```python
# app/models/user_focus.py
from sqlalchemy import Column, Integer, ForeignKey, String, Date, Float
from app.core.database import Base

class UserFocus(Base):
    __tablename__ = "user_focus"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    area_name = Column(String)
    score_when_focused = Column(Float)
    focus_start_date = Column(Date)
    focus_end_date = Column(Date)
    xp_multiplier = Column(Float, default=1.5)
    
    user = relationship("User")
```

### Passo 2: Criar Schema (Validação)

```python
# app/schemas/user_focus_schema.py
from pydantic import BaseModel
from datetime import date

class UserFocusCreate(BaseModel):
    user_id: int
    area_name: str
    xp_multiplier: float = 1.5

class UserFocusResponse(UserFocusCreate):
    id: int
    focus_start_date: date
    focus_end_date: date
```

### Passo 3: Criar Service

```python
# app/services/focus_service.py (expandir)
from app.models.user_focus import UserFocus
from datetime import date, timedelta

def generate_weekly_focus(db: Session, user_id: int):
    """Cria foco semanal para usuário"""
    area_scores = calculate_area_scores(db, user_id)
    weakest = find_weakest_area(area_scores)
    
    if not weakest:
        return None
    
    # Verificar se já existe
    today = date.today()
    active = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.focus_end_date >= today
    ).first()
    
    if active and active.area_name == weakest["area"]:
        return active  # Keep going
    
    # Criar novo
    focus = UserFocus(
        user_id=user_id,
        area_name=weakest["area"],
        score_when_focused=weakest["score"],
        focus_start_date=today,
        focus_end_date=today + timedelta(days=7),
        xp_multiplier=1.5
    )
    db.add(focus)
    db.commit()
    db.refresh(focus)
    return focus

def get_xp_multiplier(db: Session, user_id: int, area: str) -> float:
    """Retorna multiplicador se está focando nesta área"""
    today = date.today()
    focus = db.query(UserFocus).filter(
        UserFocus.user_id == user_id,
        UserFocus.area_name == area,
        UserFocus.focus_end_date >= today
    ).first()
    return focus.xp_multiplier if focus else 1.0
```

### Passo 4: Integrar com Engine

```python
# app/services/progress_engine.py (modificar)

def process_user_progress(db: Session, user_id: int, new_log=None):
    """Já existente, apenas integrar novo componente"""
    
    area_scores = calculate_area_scores(db, user_id)
    life_score = calculate_life_score(area_scores)
    
    progress = ...
    update_streak(progress)
    
    # ✨ NOVO: Calcular XP COM multiplicador de foco
    xp_gain = _calculate_xp_gain(new_log, area_scores, progress, db, user_id)
    progress.xp += xp_gain
    
    ...
    db.commit()
    return {...}


def _calculate_xp_gain(new_log, area_scores, progress, db=None, user_id=None):
    """Calcula XP com suporte a multiplicadores"""
    
    if not new_log:
        if area_scores:
            avg_score = sum(a["score"] for a in area_scores) / len(area_scores)
            return max(1, int(avg_score * 0.3))
        return 5
    
    # Base XP
    log_value = new_log.value if hasattr(new_log, 'value') else 0
    base_xp = max(1, int(log_value * 3))
    
    # ✨ NOVO: Multiplicador de foco
    multiplier = 1.0
    if db and user_id and hasattr(new_log, 'metric_type_id'):
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
```

### Passo 5: Criar Router

```python
# app/routers/focus_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.focus_service import generate_weekly_focus

router = APIRouter(prefix="/focus", tags=["focus"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{user_id}")
def get_weekly_focus(user_id: int, db: Session = Depends(get_db)):
    focus = generate_weekly_focus(db, user_id)
    
    if not focus:
        return {"message": "No focus set"}
    
    return {
        "area": focus.area_name,
        "starts": focus.focus_start_date,
        "ends": focus.focus_end_date,
        "multiplier": focus.xp_multiplier
    }
```

### Passo 6: Adicionar ao Main

```python
# app/main.py
from fastapi import FastAPI
from app.routers import focus_router

app = FastAPI()

# ... outras rotas ...
app.include_router(focus_router.router)
```

### Passo 7: Testar

```python
# test_focus.py
from app.services.focus_service import generate_weekly_focus, get_xp_multiplier

def test_focus():
    db = SessionLocal()
    
    # 1. Gerar foco
    focus = generate_weekly_focus(db, user_id=1)
    assert focus is not None
    assert focus.xp_multiplier == 1.5
    
    # 2. Verificar multiplicador
    mult = get_xp_multiplier(db, user_id=1, area="Health")
    assert mult == 1.5
    
    print("✅ Focus test passed!")
```

---

## 📋 Checklist para Adicionar Feature

```
[ ] 1. Criar modelo (models/...)
[ ] 2. Criar schema (schemas/...)
[ ] 3. Criar service (services/...)
[ ] 4. Integrar com engine se afeta progresso
[ ] 5. Criar router (routers/...)
[ ] 6. Adicionar ao main.py
[ ] 7. Criar testes
[ ] 8. Testar manualmente
[ ] 9. Validar com doc
[ ] 10. Commit com mensagem clara
```

---

## 🔍 Padrões Comuns

### Pattern 1: Calcular Algo (Sem Modificar BD)

```python
def calculate_something(db: Session, user_id: int):
    """Apenas calcula, sem side effects"""
    data = db.query(...).all()
    result = process(data)
    return result  # Sem commit!
```

### Pattern 2: Modificar Estado (Sempre via Engine)

```python
# ❌ NUNCA:
def some_router(db):
    progress = db.query(UserProgress).first()
    progress.xp += 50
    db.commit()  # Errado!

# ✅ SEMPRE:
def some_router(db):
    result = process_user_progress(db, user_id, new_log)
    return result  # Engine já atualizou
```

### Pattern 3: Aplicar Multiplicador

```python
# Na engine:
base_value = calculate_base(...)
multiplier = get_multiplier(...)  # Pode vir de focus, difficulty, etc
final_value = int(base_value * multiplier)
```

### Pattern 4: Verificar/Desbloquear Achievement

```python
def check_achievements(db, progress):
    achievements = []
    
    if progress.current_streak >= 7:
        ach = unlock("streak_7")
        achievements.append(ach)
    
    return achievements
```

---

## 🛠️ Ferramentas Úteis

### Inspecionar BD

```python
from app.core.database import SessionLocal
from app.models.user_progress import UserProgress

db = SessionLocal()
user_progress = db.query(UserProgress).filter(UserProgress.user_id == 1).first()
print(f"XP: {user_progress.xp}, Level: {user_progress.level}, Rank: {user_progress.rank}")
db.close()
```

### Testar Service Isolado

```python
# test_service.py
from app.services.scoring_service import calculate_area_scores
from app.core.database import SessionLocal

db = SessionLocal()
area_scores = calculate_area_scores(db, user_id=1)
print(area_scores)
# [{"area": "Health", "score": 8.5}, ...]
```

### Debug com Print

```python
# progress_engine.py
def process_user_progress(db, user_id, new_log=None):
    print(f"[DEBUG] Processing user {user_id}")
    area_scores = calculate_area_scores(db, user_id)
    print(f"[DEBUG] Area scores: {area_scores}")
    ...
```

---

## 📚 Referência Rápida

### Estrutura Básica de Service

```python
from sqlalchemy.orm import Session

def my_service(db: Session, user_id: int) -> dict:
    """
    Descrição clara do que faz.
    
    Args:
        db: Database session
        user_id: ID do usuário
    
    Returns:
        Dict com resultado
    """
    # 1. Buscar dados
    data = db.query(...).filter(...).all()
    
    # 2. Processar
    result = process(data)
    
    # 3. Retornar (SEM commit!)
    return result
```

### Estrutura Básica de Router

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal

router = APIRouter(prefix="/path", tags=["category"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_something(db: Session = Depends(get_db)):
    # Chamar service
    result = my_service(db, user_id=1)
    return result
```

---

## 🚨 Erros Comuns

### ❌ Erro 1: Commit em Múltiplos Lugares

```python
# ERRADO:
def router(db):
    progress = db.query(...).first()
    progress.xp = 100
    db.commit()  # ❌
    
    # outro service que também faz commit ❌
    other_service(db)

# CERTO:
def router(db):
    result = process_user_progress(db, user_id, new_log)
    # Engine já fez commit, pronto
    return result
```

### ❌ Erro 2: XP Calculado Fora da Engine

```python
# ERRADO:
xp_gain = 50  # Hardcoded
progress.xp += xp_gain

# CERTO:
xp_gain = _calculate_xp_gain(new_log, area_scores, progress)
progress.xp += xp_gain
```

### ❌ Erro 3: Modificar Progresso em Service

```python
# ERRADO:
def my_service(db, user_id):
    progress = db.query(UserProgress).first()
    progress.xp += 50  # ❌ Modificando!
    db.commit()  # ❌

# CERTO:
def my_service(db, user_id):
    # Apenas calcular
    xp = calculate_something(...)
    return xp
    # Engine aplica depois
```

### ❌ Erro 4: Assumir que BD foi Commitado

```python
# ERRADO:
result1 = service1(db)
# BD não foi commitado ainda!
result2 = service2(db)

# CERTO:
result1 = service1(db)
db.commit()  # Commit apenas quando apropriado
result2 = service2(db)
```

---

## 🎯 Workflow Recomendado

### Para Desenvolver Uma Feature

1. **Planeje** - Entenda o fluxo completo
2. **Modelo** - Crie/atualize modelo de BD
3. **Schema** - Crie validação de entrada
4. **Service** - Implemente lógica
5. **Engine** - Integre com engine se necessário
6. **Router** - Crie endpoint
7. **Teste** - Escreva teste
8. **Valide** - Rode teste manualmente
9. **Documente** - Atualize documentação

---

## 📞 FAQ Rápido

**P: Preciso fazer commit do novo_log depois de salvá-lo?**  
R: Sim! Se não, a engine não conseguirá acessar o ID.

**P: Posso chamar engine múltiplas vezes no mesmo request?**  
R: Sim! Ela é idempotente para cálculos.

**P: Como validar que tudo funciona?**  
R: Rodar `test_engine_stability.py` sempre.

**P: Preciso criar schema para cada modelo?**  
R: Sim, para validação de entrada.

**P: Posso chamar múltiplos services na engine?**  
R: Sim! A engine é um orquestrador.

**P: Como testo localmente?**  
R: `python test_nome.py` ou import direto no REPL.

---

## 🚀 Pronto?

Agora você está pronto para trabalhar em SoloLeveling!

**Próximos passos**:
1. Ler `CAMADA2_PLANO.md` com detalhes
2. Escolher feature de CAMADA 2
3. Seguir esse checklist
4. Criar feature
5. Testar
6. Celebrar! 🎉


