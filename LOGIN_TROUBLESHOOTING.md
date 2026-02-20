# 🔧 TROUBLESHOOTING - ERRO DE LOGIN

## ✅ O QUE FOI FEITO

Adicionei `console.log()` para debugar melhor. Agora quando você tentar fazer login, verá mensagens detalhadas no Console do DevTools.

---

## 📋 PASSOS PARA DEBUGAR

### 1️⃣ Abra DevTools (F12)
```
Aperte: F12
Ou: Ctrl + Shift + I
Ou: Clique direito → Inspecionar
```

### 2️⃣ Vá para aba "Console"
```
No DevTools:
├─ Elements ❌
├─ Console ✅ ← Clique aqui
├─ Sources
└─ Network
```

### 3️⃣ Tente fazer login
```
- Email: seu@email.com
- Senha: sua_senha
- Clique: "Entrar"
```

### 4️⃣ Veja as mensagens no Console
```
Você verá algo como:

✅ Se funcionar:
   → "Tentando login com: {email: ..., password: ...}"
   → "Resposta do backend: {access_token: ..., user: ...}"
   → Redireciona para dashboard

❌ Se tiver erro:
   → "Tentando login com: {email: ..., password: ...}"
   → "Erro ao fazer login: [mensagem de erro]"
   → Mensagem aparece na tela
```

---

## 🚨 ERROS COMUNS E SOLUÇÕES

### ❌ Erro: "Failed to fetch"

```
Console mostra:
Error: Network Error
ou
GET http://localhost:8000/... failed
```

**Solução:**
```powershell
# Em outro terminal:
python -m uvicorn app.main:app --reload

# Aguarde aparecer:
# "Application startup complete"
```

---

### ❌ Erro: "CORS error"

```
Console mostra:
Access to XMLHttpRequest at 'http://localhost:8000/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS
```

**Solução 1:** Verifique se backend tem CORS habilitado

```python
# No app/main.py, procure por:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou liste seus origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Solução 2:** Se não tiver, adicione no backend

---

### ❌ Erro: "Cannot read properties of undefined"

```
Console mostra:
TypeError: Cannot read properties of undefined (reading 'access_token')
```

**Motivo:** Resposta do backend é diferente do esperado

**Verificar:**
1. F12 → Network tab
2. POST /auth/login
3. Clique nele
4. Vá para "Response"
5. Verifique se tem `access_token` e `user`

**Esperado:**
```json
{
  "access_token": "eyJ0eXAi...",
  "user": {
    "id": 1,
    "name": "João",
    "email": "joao@email.com"
  }
}
```

---

### ❌ Erro: "Email ou senha incorretos"

```
Console mostra:
"Erro ao fazer login: Email ou senha incorretos"
```

**Solução:**
1. Verifique se o usuário existe
2. Verifique a senha está correta
3. Ou registre um novo usuário primeiro

**Tentar registrar:**
1. Clique em aba "Registrar"
2. Nome: "Test User"
3. Email: "test@email.com"
4. Senha: "123456"
5. Clique "Criar Conta"

---

## 🔍 COMO VER REQUISIÇÕES HTTP

### Network Tab:

1. F12 → Network tab
2. Recarregue página (F5)
3. Tente fazer login
4. Procure por requisição "login"
5. Clique nela

**Verifique:**
```
Coluna "Status":
  ✅ 200 = Sucesso
  ❌ 400 = Erro no request
  ❌ 401 = Não autorizado
  ❌ 404 = Endpoint não encontrado
  ❌ 500 = Erro no servidor
```

---

## ✅ CHECKLIST ANTES DO LOGIN

```
☐ Backend rodando em http://localhost:8000
☐ Frontend rodando em http://localhost:3000
☐ DevTools aberto (F12)
☐ Console visível
☐ Dados corretos (email + senha)
☐ Aguardando resposta do servidor (não muito rápido)
```

---

## 🆘 ÚLTIMA SOLUÇÃO

Se nada funcionar:

```powershell
# 1. Limpe node_modules
rm -r node_modules

# 2. Reinstale
npm install

# 3. Pare o servidor (Ctrl+C)
# 4. Reinicie
npm start

# 5. Teste novamente
```

---

## 📝 DADOS DE TESTE

Se não tem usuário criado, tente registrar:

```
Nome: Test User
Email: test@example.com
Senha: password123
```

Depois faça login com esses dados.

---

**Me manda a mensagem exata de erro que aparece no Console (F12) para eu ajudar mais!** 🚀

