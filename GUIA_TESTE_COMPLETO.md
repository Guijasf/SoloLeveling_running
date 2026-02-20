# 🧪 GUIA COMPLETO DE TESTE - PASSO A PASSO

## 🌐 PASSO 1: Acessar o Swagger

O Swagger deve ter aberto automaticamente em:
```
http://localhost:8000/docs
```

Se não abriu, copie e cole esse link no navegador.

---

## 📝 PASSO 2: Criar um Usuário

### 1. Localize o endpoint `POST /auth/register`
   - Está na seção **auth** (verde)
   - Clique nele para expandir

### 2. Clique em **"Try it out"** (botão azul no canto direito)

### 3. Preencha o JSON no campo **Request body**:
```json
{
  "name": "Seu Nome Aqui",
  "email": "seuemail@example.com",
  "password": "senha123"
}
```

### 4. Clique em **"Execute"** (botão azul grande)

### 5. **IMPORTANTE:** Role para baixo e copie o `access_token` da resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  ← COPIE ISSO
  "token_type": "bearer",
  "user": {
    "id": 1,  ← ANOTE ESSE ID
    "name": "Seu Nome Aqui",
    "email": "seuemail@example.com"
  }
}
```

**📝 Anote:**
- ✅ `access_token` (o token JWT)
- ✅ `id` do usuário

---

## 🔐 PASSO 3: Autenticar no Swagger

### 1. Clique no botão **"Authorize" 🔓** (no topo da página, à direita)

### 2. Uma janela vai abrir. Cole no campo **"Value"**:
```
Bearer SEU_TOKEN_AQUI
```

**EXEMPLO:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzcyMjAwNjE1fQ...
```

⚠️ **ATENÇÃO:** Não esqueça da palavra `Bearer` antes do token!

### 3. Clique em **"Authorize"**

### 4. Clique em **"Close"**

Agora você está autenticado! 🎉

---

## ✅ PASSO 4: Testar o Dashboard

### 1. Localize `GET /dashboard/{user_id}`

### 2. Clique em **"Try it out"**

### 3. No campo `user_id`, coloque o **ID** que você anotou (ex: 1)

### 4. Clique em **"Execute"**

### 5. Veja a resposta:
```json
{
  "user": { ... },
  "progress": {
    "level": 1,
    "xp": 0,
    "next_level_xp": 100,
    "streak": 0
  },
  "rank": {
    "current": "E",
    "name": "Novato",
    "emoji": "🌱"
  },
  "scores": { ... },
  "missions": { ... },
  "achievements": { ... }
}
```

✅ **Funcionou!** Você viu seu dashboard completo!

---

## 👤 PASSO 5: Testar Perfil Público (NOVO!)

### 1. Localize `GET /profile/{user_id}/public`
   - Na seção **profile** (nova!)

### 2. Clique em **"Try it out"**

### 3. Coloque seu `user_id`

### 4. Clique em **"Execute"**

### 5. Veja seu perfil público:
```json
{
  "id": 1,
  "name": "Seu Nome Aqui",
  "level": 1,
  "rank": "E",
  "rank_name": "Novato",
  "rank_emoji": "🌱",
  "total_xp": 0,
  "current_streak": 0,
  "best_streak": 0,
  "total_achievements": 0,
  "life_score": 0.0
}
```

✅ **Esse endpoint NÃO precisa de autenticação!** Pode ser compartilhado publicamente!

---

## 📊 PASSO 6: Testar Estatísticas (NOVO!)

### 1. Localize `GET /profile/{user_id}/stats`

### 2. Clique em **"Try it out"**

### 3. Coloque seu `user_id`

### 4. Clique em **"Execute"**

### 5. Veja suas estatísticas:
```json
{
  "total_days_active": 0,
  "total_logs": 0,
  "total_missions_completed": 0,
  "total_goals_completed": 0,
  "total_xp_earned": 0,
  "total_achievements": 0,
  "average_daily_xp": 0.0,
  "most_improved_area": null,
  "weakest_area": null,
  "best_streak": 0,
  "current_streak": 0,
  "trend": "stable"
}
```

✅ **Stats completas do seu progresso!**

---

## 📅 PASSO 7: Testar Calendário de Atividade (NOVO!)

### 1. Localize `GET /profile/{user_id}/activity`

### 2. Clique em **"Try it out"**

### 3. Preencha:
   - `user_id`: Seu ID
   - `days`: 7 (ou quantos dias quiser ver)

### 4. Clique em **"Execute"**

### 5. Veja o calendário:
```json
{
  "user_id": 1,
  "days_requested": 7,
  "activity": [
    {"date": "2026-02-14", "activity_count": 0},
    {"date": "2026-02-15", "activity_count": 0},
    {"date": "2026-02-16", "activity_count": 0},
    {"date": "2026-02-17", "activity_count": 0},
    {"date": "2026-02-18", "activity_count": 0},
    {"date": "2026-02-19", "activity_count": 0},
    {"date": "2026-02-20", "activity_count": 0},
    {"date": "2026-02-21", "activity_count": 0}
  ]
}
```

✅ **Heatmap de atividade!** (Todos em 0 porque é novo usuário)

---

## ⚙️ PASSO 8: Testar Configurações (NOVO!)

### 1. Localize `GET /profile/{user_id}/settings`

### 2. Clique em **"Try it out"**

### 3. Coloque seu `user_id`

### 4. Clique em **"Execute"**

### 5. Veja suas configurações padrão:
```json
{
  "profile_visibility": "public",
  "notifications_enabled": true,
  "weekly_report_enabled": true,
  "theme": "dark",
  "language": "pt-BR"
}
```

✅ **Configurações criadas automaticamente!**

---

## 🔧 PASSO 9: Atualizar Configurações (NOVO!)

### 1. Localize `PUT /profile/{user_id}/settings`

### 2. Clique em **"Try it out"**

### 3. Coloque seu `user_id`

### 4. No **Request body**, coloque o que quiser mudar:
```json
{
  "theme": "light",
  "profile_visibility": "private",
  "notifications_enabled": false
}
```

### 5. Clique em **"Execute"**

### 6. Veja a resposta com as novas configurações:
```json
{
  "profile_visibility": "private",  ← Mudou!
  "notifications_enabled": false,   ← Mudou!
  "weekly_report_enabled": true,
  "theme": "light",                 ← Mudou!
  "language": "pt-BR"
}
```

✅ **Configurações atualizadas!**

---

## 🔒 PASSO 10: Testar Perfil Privado

### 1. Agora que você definiu `profile_visibility: "private"`...

### 2. **Abra uma aba anônima** no navegador

### 3. Acesse (sem autenticação):
```
http://localhost:8000/profile/1/public
```

### 4. Você verá um erro:
```json
{
  "detail": "Este perfil é privado"
}
```

✅ **Privacidade funcionando!**

### 5. Volte para o Swagger e mude de volta para público:
```json
{
  "profile_visibility": "public"
}
```

### 6. Tente acessar novamente sem login:
```
http://localhost:8000/profile/1/public
```

✅ **Agora funciona!** Você vê o perfil público!

---

## 🎯 PASSO 11: Testar Proteção de Rotas

### 1. Tente acessar estatísticas **SEM** autenticação:

### 2. Clique no botão **"Authorize" 🔓** novamente

### 3. **Apague** o token (deixe vazio)

### 4. Clique em **"Authorize"** → **"Close"**

### 5. Tente acessar `GET /profile/{user_id}/stats`

### 6. Você verá erro **401 Unauthorized**:
```json
{
  "detail": "Not authenticated"
}
```

✅ **Proteção funcionando!** Stats só com autenticação!

---

## 📋 RESUMO DOS NOVOS ENDPOINTS

| Endpoint | Auth? | O que faz |
|----------|-------|-----------|
| `GET /profile/{id}/public` | ❌ Não | Perfil público compartilhável |
| `GET /profile/{id}/stats` | ✅ Sim | Estatísticas detalhadas |
| `GET /profile/{id}/activity` | ✅ Sim | Calendário de atividade |
| `GET /profile/{id}/settings` | ✅ Sim | Ver configurações |
| `PUT /profile/{id}/settings` | ✅ Sim | Atualizar configurações |

---

## 🧪 TESTE AUTOMATIZADO

Se preferir testar tudo automaticamente:

```bash
python test_profile_system.py
```

Isso vai executar todos os 9 testes automaticamente e mostrar:
```
✅ Perfil público acessível
✅ Estatísticas carregadas
✅ Configurações GET/PUT funcionando
✅ Perfil privado bloqueado
✅ Calendário de atividade OK
✅ Proteção de acesso funcionando
✅ TODOS OS TESTES PASSARAM! 🎉
```

---

## 🎨 DICAS VISUAIS NO SWAGGER

### Cores dos Endpoints:
- 🟢 **Verde (GET)**: Buscar dados
- 🔵 **Azul (POST)**: Criar dados
- 🟡 **Amarelo (PUT)**: Atualizar dados
- 🔴 **Vermelho (DELETE)**: Deletar dados

### Ícones:
- 🔓 **Cadeado Aberto**: Endpoint público (não precisa auth)
- 🔒 **Cadeado Fechado**: Endpoint protegido (precisa auth)

---

## ❓ TROUBLESHOOTING

### Erro "Not authenticated":
✅ Certifique-se que colocou `Bearer` antes do token

### Erro "This profile is private":
✅ Mude `profile_visibility` para `"public"`

### Endpoint não aparece:
✅ Atualize a página do Swagger (F5)

### Token expirado:
✅ Faça login novamente em `/auth/login`

---

## 🎉 PARABÉNS!

Se chegou até aqui, você testou:
- ✅ Autenticação JWT
- ✅ Dashboard consolidado
- ✅ Perfil público compartilhável
- ✅ Estatísticas detalhadas
- ✅ Calendário de atividade
- ✅ Sistema de configurações
- ✅ Controle de privacidade

**🚀 Sistema 87.5% completo e funcionando perfeitamente!**

