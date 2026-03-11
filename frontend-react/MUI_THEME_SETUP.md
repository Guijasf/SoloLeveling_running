# MUI Theme System - Solo Leveling

## 📦 Instalação Completa

MUI (Material-UI) foi instalado com sucesso com os seguintes pacotes:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### Pacotes Instalados:
- **@mui/material** (v7.3.9) - Componentes principais
- **@mui/icons-material** (v7.3.9) - Biblioteca com 1000+ ícones
- **@emotion/react** (v11.14.0) - Motor de renderização de CSS
- **@emotion/styled** (v11.14.1) - Sintaxe styled-components

---

## 🎨 Temas Implementados

### Tema Default (Original)
```javascript
{
  bg: '#0a0f1b',
  card: '#0f1623',
  green: '#22ff88',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#ff6b35',
  text: '#e5e7eb',
  textSoft: '#a1a5b0',
  border: '#1f2937',
}
```

### Tema ARISE (Purple/Cyan)
```javascript
{
  bg: '#1a1626',
  card: '#2d1f3f',
  green: '#00d9ff',
  blue: '#7c5cff',
  purple: '#9d4edd',
  orange: '#ff006e',
  text: '#f0f0f0',
  textSoft: '#b0b0c0',
  border: '#3d2d5f',
}
```

---

## 🔧 Arquitetura de Temas

### 1. `src/theme.js`
Define as configurações de temas usando MUI's `createTheme()`:
- Paleta de cores
- Tipografia
- Componentes customizados

```javascript
import { getTheme } from './theme';

const theme = getTheme('default'); // ou 'arise'
```

### 2. `src/context/ThemeContext.js`
Gerencia o estado global do tema:
- `themeName` - Nome do tema atual
- `setTheme(name)` - Mudar tema
- `toggleTheme()` - Alternar entre temas
- `isAriseTheme` - Boolean para verificar se está no ARISE

```javascript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { themeName, setTheme } = useTheme();
  // ...
}
```

### 3. `src/App.js`
Integra:
- `ThemeProvider` (nosso contexto)
- `MuiThemeProvider` (do MUI)
- `CssBaseline` (reset de estilos)

---

## 🚀 Como Usar

### 1. Componente com Tema
```jsx
import { useTheme } from './context/ThemeContext';
import { Button, Card, CardContent, Typography } from '@mui/material';

function MyComponent() {
  const { themeName } = useTheme();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          Tema atual: {themeName}
        </Typography>
        <Button variant="contained" color="primary">
          Clique aqui
        </Button>
      </CardContent>
    </Card>
  );
}
```

### 2. Alternar Tema
```jsx
import { useTheme } from './context/ThemeContext';

function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme();

  return (
    <select value={themeName} onChange={(e) => setTheme(e.target.value)}>
      <option value="default">Default</option>
      <option value="arise">ARISE</option>
    </select>
  );
}
```

### 3. Usar Ícones
```jsx
import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

function ButtonWithIcon() {
  return (
    <Button
      variant="contained"
      startIcon={<HomeIcon />}
    >
      Home
    </Button>
  );
}
```

---

## 📋 Componentes Disponíveis

### Layout & Container
- **Container** - Container responsivo
- **Box** - Container flexível com sx props
- **Grid** - Sistema de grid 12-colunas
- **Stack** - Layout linear (row/column)

### Inputs & Forms
- **TextField** - Campo de entrada com label
- **Select** - Dropdown
- **Checkbox** - Checkbox
- **Radio** - Radio button
- **Switch** - Toggle switch
- **FormControlLabel** - Label para inputs

### Data Display
- **Table** - Tabela com rows, cells, etc
- **Card** - Container com elevação
- **List** - Lista com itens
- **Typography** - Textos com variantes
- **Chip** - Tags e labels
- **Avatar** - Avatar circular

### Feedback
- **Alert** - Mensagens de alerta
- **Snackbar** - Notificação temporária
- **Dialog** - Modal
- **Loading** (CircularProgress/LinearProgress)

### Navigation
- **AppBar** - Navbar
- **Toolbar** - Barra de ferramentas
- **Drawer** - Menu lateral
- **Tabs** - Abas
- **Breadcrumbs** - Breadcrumb

### Actions
- **Button** - Botão (contained, outlined, text)
- **IconButton** - Botão com ícone
- **ButtonGroup** - Grupo de botões
- **ToggleButton** - Botão toggle

---

## 🎯 Ícones Populares

```javascript
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  FavoriteBorder as HeartIcon,
  Star as StarIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
```

Lista completa: https://mui.com/material-ui/material-icons/

---

## 🎨 Customizar Componentes com SX

```jsx
<Box
  sx={{
    // Layout
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    
    // Spacing
    p: 2,      // padding
    m: 1,      // margin
    mt: 2,     // margin-top
    
    // Colors
    color: 'primary.main',
    backgroundColor: 'background.paper',
    
    // Sizing
    width: '100%',
    height: 'auto',
    
    // Responsive
    backgroundColor: { xs: 'red', md: 'blue' },
    
    // Pseudo-classes
    '&:hover': {
      backgroundColor: 'primary.light',
    },
    
    // Media queries
    '@media (max-width: 600px)': {
      fontSize: '12px',
    }
  }}
>
  Content
</Box>
```

---

## 💾 Persistência de Tema

O tema é automaticamente:
1. Salvo em `localStorage` com a chave `sololeveling_theme`
2. Restaurado ao carregar a página
3. Sincronizado em todas as páginas via Context

```javascript
// Recuperar tema salvo
const savedTheme = localStorage.getItem('sololeveling_theme'); // 'default' ou 'arise'

// Mudar tema
setTheme('arise');
// → Automaticamente salva em localStorage
```

---

## 🔗 Integração com Páginas Existentes

Substitua gradualmente:
```javascript
// Antes (HTML/CSS puro)
<div className="card">
  <button className="btn-primary">Click</button>
</div>

// Depois (MUI)
import { Card, CardContent, Button } from '@mui/material';

<Card>
  <CardContent>
    <Button variant="contained" color="primary">Click</Button>
  </CardContent>
</Card>
```

---

## 📚 Exemplos

### Exemplo 1: Card com Lista
```jsx
import { Card, CardContent, List, ListItem, Typography } from '@mui/material';

<Card>
  <CardContent>
    <Typography variant="h5">Tarefas</Typography>
    <List>
      <ListItem>Tarefa 1</ListItem>
      <ListItem>Tarefa 2</ListItem>
    </List>
  </CardContent>
</Card>
```

### Exemplo 2: Grid Responsivo
```jsx
import { Grid, Card, CardContent, Typography } from '@mui/material';

<Grid container spacing={2}>
  <Grid item xs={12} md={6} lg={4}>
    <Card>
      <CardContent>
        <Typography>Card 1</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={6} lg={4}>
    <Card>
      <CardContent>
        <Typography>Card 2</Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>
```

### Exemplo 3: Formulário
```jsx
import { TextField, Button, Box } from '@mui/material';

<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <TextField label="Nome" variant="outlined" fullWidth />
  <TextField label="Email" type="email" variant="outlined" fullWidth />
  <Button variant="contained" color="primary">
    Enviar
  </Button>
</Box>
```

---

## 🐛 Troubleshooting

### Componentes não aparecem com cores corretas?
Certifique-se que `ThemeProvider` envolve a aplicação em `App.js`.

### Tema não persiste?
Verifique se localStorage está habilitado e se a chave é `sololeveling_theme`.

### Ícones não carregam?
Importe corretamente de `@mui/icons-material`:
```javascript
import { Home as HomeIcon } from '@mui/icons-material';
```

---

## 📖 Documentação Oficial

- MUI Docs: https://mui.com/
- Material Design: https://m3.material.io/
- Emotion Docs: https://emotion.sh/docs/introduction

---

## ✅ Próximos Passos

1. ✅ MUI instalado
2. ✅ Temas Default e ARISE implementados
3. ✅ Theme Context criado
4. ✅ App.js integrado
5. 🔜 Converter componentes das páginas para MUI
6. 🔜 Criar componentes reutilizáveis
7. 🔜 Testar responsividade
8. 🔜 Otimizar performance

---

**Desenvolvido para Solo Leveling - Sistema Gamificado de Progresso Pessoal**
