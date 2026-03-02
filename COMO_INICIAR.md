# 🚀 Como Iniciar SoloLeveling

## ⚡ Início Rápido

### Opção 1: Windows Batch (Mais simples)
1. Abra o explorador de arquivos
2. Navegue até: `C:\Users\Guilherme.amaral\Documents\SoloLeveling`
3. **Clique duas vezes em `START.bat`**
4. Duas janelas abrirão automaticamente

### Opção 2: PowerShell (Com mais controle)
1. Abra o PowerShell
2. Navegue até o projeto:
   ```powershell
   cd C:\Users\Guilherme.amaral\Documents\SoloLeveling
   ```
3. Execute:
   ```powershell
   .\START.ps1
   ```

### Opção 3: Manual (Controle total)

#### Terminal 1 - Backend:
```powershell
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend:
```powershell
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react
npm start
```

---

## 📍 URLs de Acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:3000 | Aplicação React |
| **Backend** | http://localhost:8000 | API FastAPI |
| **Swagger** | http://localhost:8000/docs | Documentação interativa da API |
| **ReDoc** | http://localhost:8000/redoc | Documentação ReDoc |

---

## 🔍 Verificando se está funcionando

### Backend ✅
- Acesse: http://localhost:8000/docs
- Você deve ver a documentação Swagger interativa

### Frontend ✅
- Acesse: http://localhost:3000
- Você deve ver a página de login

---

## ❌ Se algo der errado

### "npm não é reconhecido"
- Node.js não está instalado ou não está no PATH
- Solução: Instale Node.js em https://nodejs.org/
- Depois reinstale dependências:
  ```powershell
  cd C:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react
  npm install
  ```

### "python não é reconhecido"
- Python não está instalado ou não está no PATH
- Solução: Adicione Python ao PATH do Windows
- Ou use seu venv: `. venv\Scripts\Activate`

### "Porta 8000 já está em uso"
- Outro processo está usando a porta
- Solução: Mude para outra porta:
  ```powershell
  python -m uvicorn app.main:app --reload --port 8001
  ```

### "Erro de conexão com banco de dados"
- O banco pode não estar configurado
- Verifique em `app/core/database.py`
- Ou regenere: `python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"`

---

## 📱 Fluxo de Uso

1. **Abra o Frontend**: http://localhost:3000
2. **Faça login ou crie uma conta**
3. **Navegue pelo dashboard**
4. **Crie áreas de vida, metas e tarefas**
5. **Veja o sistema adaptar a dificuldade**

---

## 🧪 Testando a API

### Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@test.com","password":"sua_senha"}'
```

### Obter Dashboard
```bash
curl -X GET "http://localhost:8000/dashboard/me" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 💡 Dicas Importantes

1. **Deixe ambas as janelas abertas** - Os logs ajudam a debugar problemas
2. **Ctrl+C para parar** - Em qualquer uma das janelas
3. **Hot reload ativado** - Alterações no código recarregam automaticamente
4. **Verifique o navegador** - Abra o DevTools (F12) se algo parecer estranho

---

## 🚀 Próximas Etapas

Após iniciar com sucesso:
1. Explore o Swagger em http://localhost:8000/docs
2. Teste o login no frontend
3. Crie áreas de vida (Health, Finance, etc)
4. Adicione metas e tarefas
5. Veja o sistema se adaptar

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs nas janelas abertas
2. Procure por mensagens de erro
3. Verifique a porta (8000 e 3000) estão disponíveis
4. Tente executar `npm install` no frontend-react

---

**Boa sorte! 🎮**

