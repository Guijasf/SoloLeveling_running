# 🚀 GUIA RÁPIDO - COMO RODAR O REACT FRONTEND

## 📋 O que você vai fazer agora

Você vai ter um **frontend React profissional** conectado ao seu backend FastAPI.

## 🛠️ Pré-requisitos

Você precisa ter instalado:
- **Node.js 16+** ([Download aqui](https://nodejs.org/))
- **npm** (vem com Node.js)

Para verificar:
```powershell
node --version
npm --version
```

## 📝 Passos Exatos

### 1️⃣ Entrar na pasta do React

```powershell
cd C:\Users\Guilherme.amaral\Documents\SoloLeveling\frontend-react
```

### 2️⃣ Instalar dependências

```powershell
npm install
```

⏱️ **Pode levar 2-5 minutos...**

Isso vai baixar:
- React
- React Router
- Axios
- Chart.js
- E mais...

### 3️⃣ Criar arquivo .env

Crie um arquivo `.env` na pasta `frontend-react`:

```powershell
cp .env.example .env
```

Ou crie manualmente com conteúdo:
```
REACT_APP_API_URL=http://localhost:8000
```

### 4️⃣ Iniciar o servidor

```powershell
npm start
```

🎉 **A página vai abrir automaticamente em http://localhost:3000**

## ✅ O que fazer agora

1. **Verifique se o backend está rodando:**
   ```powershell
   # Em outro PowerShell, na pasta SoloLeveling
   python -m uvicorn app.main:app --reload
   ```

2. **Vá para http://localhost:3000**

3. **Teste o login:**
   - Email: seu email
   - Senha: sua senha

4. **Veja o dashboard:**
   - Nível, Rank, XP
   - Gráfico radar
   - Missões
   - Conquistas

## 🎯 Estrutura do Projeto

```
frontend-react/
├── src/
│   ├── components/        # Components (Header, Cards, etc)
│   ├── pages/            # Páginas (Login, Dashboard, Settings)
│   ├── context/          # State global (Autenticação)
│   ├── utils/            # API client
│   └── App.js            # Componente principal
├── public/               # Arquivos estáticos
├── package.json
└── README.md
```

## 🔧 Troubleshooting

### ❌ "npm não é reconhecido"
- Node.js não está instalado
- **Solução**: [Instale Node.js](https://nodejs.org/)
- Reinicie o PowerShell depois

### ❌ "CORS error"
- Backend não está rodando
- **Solução**: Inicie o backend com `python -m uvicorn app.main:app --reload`

### ❌ "Cannot find module 'react'"
- Dependências não foram instaladas
- **Solução**: Rode `npm install` novamente

### ❌ "Porta 3000 já está em uso"
- Outra aplicação está usando a porta
- **Solução**: Feche a outra app ou use `npm start -- --port 3001`

## 💡 Dicas Úteis

### Ver logs do console
Abra DevTools: **F12** → **Console**

### Debugar requisições
DevTools → **Network** → faça login e veja as requisições

### Editar código
Qualquer arquivo que você editar em `src/` vai fazer o page recarregar automaticamente (hot reload)

## 🚀 Próximos Passos

Depois que estiver funcionando:

1. **Integrar mais endpoints** do seu backend
2. **Adicionar histórico gráfico** com timestamps
3. **Implementar WebSocket** para notificações em tempo real
4. **Dark/Light theme toggle**
5. **Deploy em produção** (Vercel, Netlify, etc)

## 📚 Arquivos Principais

| Arquivo | O que faz |
|---------|-----------|
| `src/App.js` | Roteamento e autenticação |
| `src/pages/LoginPage.js` | Tela de login/registro |
| `src/pages/DashboardPage.js` | Tela principal |
| `src/components/ProfileCard.js` | Card de perfil |
| `src/components/RadarChart.js` | Gráfico radar |
| `src/utils/api.js` | Cliente HTTP com token |

## 🎨 Customização

### Trocar cores
Edite nos arquivos `.css`:
- **Verde**: `#16c784` → sua cor
- **Verde Escuro**: `#0fb981` → sua cor

### Adicionar novo componente
1. Crie arquivo em `src/components/MeuComponente.js`
2. Importe em `src/pages/DashboardPage.js`
3. Use: `<MeuComponente />`

## 📞 Precisa de ajuda?

Verifique o console (F12) para erros específicos.

---

**Pronto? Vá pro terminal e execute:**

```powershell
cd frontend-react && npm install && npm start
```

🎮 **Boa sorte!**

