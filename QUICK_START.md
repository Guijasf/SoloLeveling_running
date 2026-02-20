# 🚀 Quick Start - SoloLeveling API

## 📦 Instalação Rápida

### 1. Clone o repositório
```bash
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling
```

### 2. Instale as dependências
```bash
pip install -r requirements.txt
```

### 3. Inicie o servidor
```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Acesse o Swagger
Abra no navegador:
```
http://localhost:8000/docs
```

---

## 🧪 Teste Rápido

### Opção 1: Via Swagger (Interface Visual)

1. Acesse http://localhost:8000/docs
2. Clique em `POST /auth/register`
3. Clique em "Try it out"
4. Preencha:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```
5. Execute e copie o `access_token`
6. Clique no botão **Authorize** 🔓
7. Cole: `Bearer SEU_TOKEN_AQUI`
8. Teste `GET /dashboard/{user_id}`

### Opção 2: Via Python
```bash
python test_api_auth.py
```

### Opção 3: Via curl
```bash
# Registro
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"senha123"}'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'

# Dashboard (use o token recebido)
curl -X GET "http://localhost:8000/dashboard/1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📊 Endpoints Principais

### 🔐 Autenticação
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Ver perfil (protegido)

### 📊 Dashboard
- `GET /dashboard/{user_id}` - Dashboard completo (protegido)

### 👥 Usuários
- `GET /users` - Listar usuários (protegido)
- `GET /users/{id}` - Ver usuário (protegido)

### 🎯 Áreas da Vida
- `POST /life-areas` - Criar área (ex: Health, Career)
- `GET /life-areas` - Listar áreas

### 📈 Métricas
- `POST /metric-logs` - Registrar métrica (dispara engine!)
- `GET /metric-logs` - Ver histórico

### 🎮 Missões
- `GET /missions/{user_id}` - Missões de hoje
- `POST /missions/{id}/complete` - Completar missão

### 🏆 Conquistas
- `GET /achievements/{user_id}` - Ver conquistas

### 🎯 Foco Semanal
- `GET /focus/{user_id}/generate` - Gerar foco automático
- `GET /focus/{user_id}/current` - Ver foco atual

---

## 🗂️ Estrutura do Projeto

```
SoloLeveling/
├── app/
│   ├── main.py                 # FastAPI app
│   ├── core/
│   │   ├── database.py         # Configuração SQLAlchemy
│   │   ├── security.py         # JWT + bcrypt
│   │   └── dependencies.py     # Middleware auth
│   ├── models/                 # Modelos SQLAlchemy
│   ├── routers/                # Endpoints da API
│   │   ├── auth_router.py      # 🔐 Login/Registro
│   │   ├── dashboard_router.py # 📊 Dashboard consolidado
│   │   ├── user_router.py
│   │   ├── mission_router.py
│   │   └── ...
│   ├── services/               # Lógica de negócio
│   │   ├── progress_engine.py  # 🧠 Engine principal
│   │   ├── scoring_service.py
│   │   ├── mission_service.py
│   │   ├── achievement_service.py
│   │   └── ...
│   └── schemas/                # Pydantic schemas
├── tests/                      # Testes
│   ├── test_auth.py
│   ├── test_api_auth.py
│   └── ...
├── requirements.txt            # Dependências
└── solo_leveling.db            # Banco SQLite

```

---

## 🔒 Segurança

✅ **Senhas hasheadas** com bcrypt
✅ **JWT tokens** com expiração de 7 dias  
✅ **Rotas protegidas** com Bearer authentication
✅ **Validações** de email, senhas, permissões

---

## 📚 Documentação Completa

- `FASE3_IMPLEMENTADA.md` - Guia completo da API
- `COMMIT_MESSAGE.md` - Sugestões de commit
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## ✅ Status Atual

```
✅ FASE 1 - Engine Estabilizada
✅ FASE 2 - Inteligência do Sistema
✅ FASE 3 - MVP Público (Autenticação + Dashboard)
⏳ FASE 4 - Produto Comercial (próximo)
```

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
2. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

---

## 📝 Licença

MIT License - veja arquivo LICENSE para detalhes.

---

**🎮 Transforme sua vida em um RPG! 🚀**

