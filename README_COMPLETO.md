# 🎮 SoloLeveling - Documentação Consolidada

**Última atualização:** 12 de Março de 2026  
**Status:** ✅ Em desenvolvimento com HTMLs estáticos + Backend Python

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura](#arquitetura)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Setup & Instalação](#setup--instalação)
5. [Como Usar](#como-usar)
6. [Aplicações Core](#aplicações-core)
7. [Backend API](#backend-api)
8. [Desenvolvimento](#desenvolvimento)
9. [Docker](#docker)
10. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 🎯 Visão Geral do Projeto

**SoloLeveling** é um sistema gamificado de produtividade que transforma suas metas e hábitos em uma experiência RPG.

### Características Principais

- 🎮 **Gamificação completa** - Níveis, XP, Ranking, Achievements
- 📊 **Dashboard interativo** com gráficos e análise de progresso
- ✅ **Gerenciador de tarefas** com rastreamento em tempo real
- 🎯 **Sistema de metas** adaptável por área de vida
- 🔄 **Hábitos com streak** contador de sequências
- 📈 **Análise de evolução** semanal e mensal
- 🔐 **Autenticação segura** com JWT
- 📱 **Responsivo** para desktop e mobile

---

## 🏗️ Arquitetura

### Stack Tecnológico

**Frontend (HTMLs Estáticos):**
- HTML5
- Material-UI (MUI) via CDN
- JavaScript Vanilla + Modules
- Axios para requisições HTTP

**Backend (Python):**
- FastAPI
- SQLAlchemy ORM
- SQLite/PostgreSQL
- JWT Authentication
- Pydantic

### Fluxo da Aplicação

```
[Frontend - public/*.html] 
        ↓ Axios
[Backend API - FastAPI] 
        ↓ SQLAlchemy
[Database - SQLite/PostgreSQL]
```

---

## 📁 Estrutura de Pastas

```
SoloLeveling/
│
├── 📂 frontend-react/                # Aplicações HTML estáticas
│   ├── 📂 public/                    # ⭐ APLICAÇÕES CORE
│   │   ├── index.html                # Landing page
│   │   ├── dashboard.html            # Dashboard principal
│   │   ├── tasks.html                # Gerenciador de tarefas
│   │   ├── habits.html               # Rastreador de hábitos
│   │   └── goals.html                # Gerenciador de metas
│   │
│   ├── 📂 src/                       # Suporte React (opcional)
│   │   ├── utils/api.js              # Cliente HTTP
│   │   ├── context/                  # Estado global
│   │   └── styles/                   # Design system
│   │
│   ├── package.json                  # Dependências frontend
│   └── README.md                     # Quick start
│
├── 📂 app/                           # Backend FastAPI
│   ├── main.py                       # Entry point
│   ├── 📂 core/
│   │   ├── database.py               # Conexão com DB
│   │   ├── security.py               # Autenticação JWT
│   │   └── dependencies.py           # DI
│   │
│   ├── 📂 models/                    # ORM Models
│   │   ├── user.py
│   │   ├── daily_mission.py
│   │   ├── goal.py
│   │   ├── user_focus.py
│   │   ├── achievement.py
│   │   ├── metric_log.py
│   │   └── ...
│   │
│   ├── 📂 routers/                   # Endpoints API
│   │   ├── auth.py                   # /auth/*
│   │   ├── user.py                   # /user/*
│   │   ├── dashboard.py              # /dashboard/*
│   │   ├── missions.py               # /missions/*
│   │   ├── goals.py                  # /goals/*
│   │   ├── habits.py                 # /habits/*
│   │   ├── metrics.py                # /metrics/*
│   │   ├── achievements.py           # /achievements/*
│   │   └── ...
│   │
│   ├── 📂 schemas/                   # Pydantic models
│   ├── 📂 services/                  # Lógica de negócio
│   └── 📂 utils/                     # Utilitários
│
├── 📂 data/                          # Dados e migrations
├── 🗄️ solo_leveling.db              # Database SQLite
│
├── 🐘 docker-compose.yml             # Orquestração
├── requirements.txt                  # Dependências Python
├── .env.example                      # Configuração exemplo
├── .gitignore
└── README.md                         # Este arquivo
```

---

## 🚀 Setup & Instalação

### Pré-requisitos

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (opcional)

### Instalação Local

#### 1. Backend

```bash
# Instalar dependências Python
pip install -r requirements.txt

# Criar arquivo .env (copie de .env.example)
cp .env.example .env

# Rodar migrações
python app/main.py
```

#### 2. Frontend

```bash
cd frontend-react

# Instalar dependências Node
npm install

# Ou vazio se apenas usar HTMLs estáticos
# Os HTMLs funcionam sem dependências Node
```

### Instalação Docker

```bash
# Build e rodar com Docker Compose
docker-compose up -d

# Backend rodará em http://localhost:8000
# Frontend em http://localhost:3000
```

---

## 📖 Como Usar

### Iniciar o Backend

```bash
# Desenvolvimento com reload automático
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Ou usar script
python run_backend_simple.py
```

### Acessar a Aplicação

- **Documentação API:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Dashboard:** [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)
- **Tasks:** [http://localhost:3000/tasks.html](http://localhost:3000/tasks.html)
- **Habits:** [http://localhost:3000/habits.html](http://localhost:3000/habits.html)
- **Goals:** [http://localhost:3000/goals.html](http://localhost:3000/goals.html)

---

## 🎯 Aplicações Core

### 1. Dashboard (`public/dashboard.html`)

**Propósito:** Visão geral do progresso do usuário

**Componentes:**
- Perfil do usuário com nível/XP
- Gráfico radar de progresso por área
- Cards de achievements
- Estatísticas diárias
- Histórico de atividades

**Dados do Backend:**
```
GET /dashboard/{user_id}
└─ level, rank, xp, streak
   area_scores[], today_missions[], achievements[]
```

---

### 2. Tasks (`public/tasks.html`)

**Propósito:** Gerenciar tarefas diárias

**Funcionalidades:**
- Criar/Editar/Deletar tarefas
- Marcar como concluída
- Priorização
- Rastreamento de XP

**Endpoints API:**
```
POST /missions/create
GET /missions/today
PUT /missions/{id}/complete
DELETE /missions/{id}
```

---

### 3. Habits (`public/habits.html`)

**Propósito:** Rastrear e manter hábitos

**Funcionalidades:**
- Criar hábitos customizados
- Contador de streak
- Histórico de conclusão
- Gráfico de consistência

**Endpoints API:**
```
POST /habits/create
GET /habits/list
PUT /habits/{id}/complete
GET /habits/{id}/history
```

---

### 4. Goals (`public/goals.html`)

**Propósito:** Gerenciar metas adaptáveis

**Funcionalidades:**
- Criar metas por área de vida
- Definir prazo e progresso
- Decompor em sub-metas
- Análise de conclusão

**Endpoints API:**
```
POST /goals/create
GET /goals/list
PUT /goals/{id}/update-progress
DELETE /goals/{id}
```

---

## 🔌 Backend API

### Autenticação

Todas as rotas protegidas requerem JWT no header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Endpoints Principais

#### Authentication
```
POST /auth/register          # Registrar novo usuário
POST /auth/login             # Login (retorna token)
POST /auth/refresh           # Renovar token
```

#### User
```
GET /user/profile            # Perfil do usuário
PUT /user/update             # Atualizar dados
GET /user/stats              # Estatísticas gerais
```

#### Dashboard
```
GET /dashboard/{user_id}     # Dados completos do dashboard
```

#### Missions (Tarefas)
```
POST /missions/create        # Criar tarefa
GET /missions/today          # Tarefas de hoje
GET /missions/list           # Todas as tarefas
PUT /missions/{id}/complete  # Marcar concluída
DELETE /missions/{id}        # Deletar tarefa
```

#### Habits
```
POST /habits/create          # Criar hábito
GET /habits/list             # Listar hábitos
PUT /habits/{id}/complete    # Marcar dia como completo
GET /habits/{id}/history     # Histórico
DELETE /habits/{id}          # Deletar hábito
```

#### Goals
```
POST /goals/create           # Criar meta
GET /goals/list              # Listar metas
PUT /goals/{id}/progress     # Atualizar progresso
DELETE /goals/{id}           # Deletar meta
GET /goals/{id}/analysis     # Análise da meta
```

#### Achievements
```
GET /achievements/list       # Listar achievements
GET /achievements/{id}       # Detalhes
POST /achievements/claim     # Reclamar achievement
```

---

## 💻 Desenvolvimento

### Backend - Adicionar Novo Endpoint

1. **Criar schema em `schemas/`:**
```python
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str
    priority: int = 1
```

2. **Criar modelo em `models/`:**
```python
from sqlalchemy import Column, Integer, String
from core.database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True)
    title = Column(String)
    # ... mais campos
```

3. **Criar router em `routers/`:**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/create")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    # Implementação
    return {"status": "success"}
```

4. **Importar em `main.py`:**
```python
from routers import tasks_router
app.include_router(tasks_router.router)
```

### Frontend - Conectar Novo HTML

1. **Criar `public/novo-recurso.html`**
2. **Usar Axios para requisições:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Usar
api.get('/tasks/list')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

---

## 🐳 Docker

### Build

```bash
docker-compose build
```

### Rodar

```bash
docker-compose up -d
```

### Parar

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f app
```

---

## 📱 Responsividade

Usar **Material-UI** para garantir responsividade:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mui/material@latest/dist/mui.min.css">
```

Componentes MUI responsivos automaticamente:
- Grid (12 colunas)
- Container (max-width adaptável)
- Box (flexbox utilities)

---

## 🔐 Segurança

### JWT Tokens

- **Access Token:** Válido por 30 minutos
- **Refresh Token:** Válido por 7 dias
- **Armazenamento:** localStorage (frontend)

### Proteção de Rotas

```python
from fastapi import Depends, HTTPException
from core.security import get_current_user

@app.get("/protected")
def protected_route(current_user = Depends(get_current_user)):
    return {"user": current_user.username}
```

---

## 📊 Database Schema

### Principais Tabelas

**users**
```
id, username, email, password_hash, level, xp, rank, created_at
```

**daily_missions**
```
id, user_id, title, description, status, xp_reward, completed_at
```

**habits**
```
id, user_id, name, frequency, streak_current, streak_record, created_at
```

**goals**
```
id, user_id, title, area_of_life, target_value, current_value, deadline, status
```

**achievements**
```
id, name, description, icon, user_id, unlocked_at
```

---

## 🐛 Troubleshooting

### Erro: "Connection refused" (Backend)

**Solução:**
```bash
# Verificar se backend está rodando
netstat -ano | findstr :8000

# Ou rodar manualmente
python run_backend_simple.py
```

### Erro: "JWT token expired"

**Solução:**
```javascript
// Usar refresh token para obter novo access token
api.post('/auth/refresh', {
  refresh_token: localStorage.getItem('refresh_token')
});
```

### Erro: "CORS blocked"

**Verificar `app/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 401 Unauthorized

**Verificar:**
1. Token está em localStorage?
2. Token ainda válido?
3. Header `Authorization` está correto?

---

## 📝 Tipos de Dados

### User Level System

```
Level 1:    0 - 100 XP
Level 2:    100 - 300 XP
Level 3:    300 - 600 XP
...
Level 100:  50000+ XP
```

### Rank System

```
E → D → C → B → A → S
```

### Life Areas

```
Work, Health, Finance, Relationships, Personal Growth, Leisure
```

---

## 🚀 Roadmap

- [x] Backend API completa
- [x] Sistema de autenticação
- [x] Dashboard funcional
- [x] Gerenciador de metas adaptáveis
- [ ] Inteligência artificial para recomendações
- [ ] Mobile app nativa
- [ ] Sistema de multiplayer/social
- [ ] Integração com calendário

---

## 📞 Support

Para dúvidas ou issues:

1. Verificar [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger)
2. Consultar código de exemplo nos routers
3. Revisar schemas em `schemas/`

---

## 📄 Licença

MIT - Veja LICENSE para detalhes

---

**Desenvolvido com ❤️ por Guilherme Amaral**

*Última atualização: 12 de Março de 2026*
