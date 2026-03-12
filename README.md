# 🎮 SoloLeveling - Sistema Gamificado de Produtividade

**Status:** ✅ Em desenvolvimento com arquitetura limpa

---

## ⚡ Quick Start

### Backend

```bash
# Instalar dependências
pip install -r requirements.txt

# Rodar
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend (HTMLs Estáticos)

Os arquivos HTML estão em `frontend-react/public/`:

- `dashboard.html` - Dashboard principal
- `tasks.html` - Gerenciador de tarefas
- `habits.html` - Rastreador de hábitos
- `goals.html` - Gerenciador de metas

Para servir localmente:
```bash
cd frontend-react
npx http-server public
```

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   HTML Files    │  frontend-react/public/
│    (MUI + JS)   │
└────────┬────────┘
         │ Axios
         ↓
┌─────────────────┐
│  FastAPI (Python)│  app/
│  JWT + SQLite   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Database      │  solo_leveling.db
└─────────────────┘
```

---

## 📁 Estrutura

```
SoloLeveling/
├── frontend-react/
│   ├── public/                      ⭐ CORE APPS
│   │   ├── dashboard.html           Dashboard principal
│   │   ├── tasks.html               Gerenciador de tarefas
│   │   ├── habits.html              Rastreador de hábitos
│   │   └── goals.html               Gerenciador de metas
│   └── src/
│       ├── context/                 Contextos React (auth, theme)
│       ├── utils/                   API client (axios)
│       └── styles/                  Design system
│
├── app/                             ⭐ BACKEND API
│   ├── main.py                      FastAPI - Entry point
│   ├── core/
│   │   ├── database.py              SQLite config
│   │   ├── security.py              JWT auth
│   │   └── dependencies.py          Dependency injection
│   ├── models/                      ORM Models
│   ├── routers/                     API Endpoints
│   └── schemas/                     Validação Pydantic
│
├── requirements.txt                 Python dependencies
├── .env.example                     Config example
├── docker-compose.yml               Docker config
├── README.md                        Este arquivo
└── README_COMPLETO.md               Documentação detalhada ⭐
```

---

## 🚀 Endpoints Principais

### Auth
```
POST /auth/register
POST /auth/login
POST /auth/refresh
```

### User
```
GET /user/profile
PUT /user/update
GET /user/stats
```

### Missions
```
POST /missions/create
GET /missions/today
PUT /missions/{id}/complete
```

### Goals
```
POST /goals/create
GET /goals/list
PUT /goals/{id}/progress
```

### Habits
```
POST /habits/create
GET /habits/list
PUT /habits/{id}/complete
```

### Dashboard
```
GET /dashboard/{user_id}
```

**Documentação interativa:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔧 Desenvolvimento

### Adicionar Novo Endpoint

1. Criar `schemas/novo_modelo.py`
2. Criar `models/novo_modelo.py`
3. Criar `routers/novo_modelo.py`
4. Importar em `app/main.py`

### Conectar HTML com Backend

```javascript
// Criar cliente axios
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Usar
api.get('/endpoint').then(res => console.log(res.data));
```

---

## 🐳 Docker

```bash
docker-compose up -d
```

---

## 📚 Documentação Completa

Para detalhes sobre:
- Database schema
- Autenticação JWT
- Todos os endpoints
- Desenvolvimento step-by-step
- Troubleshooting

**Veja:** [README_COMPLETO.md](README_COMPLETO.md)

---

## 🎯 Próximas Etapas

- [ ] Integrar MUI nos HTMLs
- [ ] Conectar frontend com backend API
- [ ] Implementar autenticação JWT no frontend
- [ ] Criar dashboard interativo
- [ ] Adicionar gráficos com Chart.js
- [ ] Sistema de notificações

---

**Desenvolvido com ❤️**

