# 🚀 MUI Quick Start - Solo Leveling

## 5 Minutos para Começar

### 1️⃣ Importar Componentes
```jsx
import { 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Box,
  Typography 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
```

### 2️⃣ Usar Hook de Tema
```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { themeName, setTheme } = useTheme();
  
  return (
    <div>
      Tema: {themeName}
      <button onClick={() => setTheme('arise')}>ARISE</button>
    </div>
  );
}
```

### 3️⃣ Criar Layout
```jsx
<Container maxWidth="lg">
  {/* Seu conteúdo aqui */}
</Container>
```

### 4️⃣ Card com Conteúdo
```jsx
<Card>
  <CardContent>
    <Typography variant="h5">Título</Typography>
    <Typography variant="body2">Descrição</Typography>
  </CardContent>
</Card>
```

### 5️⃣ Botões e Inputs
```jsx
<TextField 
  label="Nome" 
  variant="outlined" 
  fullWidth 
/>
<Button 
  variant="contained" 
  color="primary"
  startIcon={<AddIcon />}
>
  Criar
</Button>
```

---

## 📦 Componentes Mais Comuns

| Uso | Componente | Exemplo |
|-----|-----------|---------|
| Botão | `<Button>` | `<Button variant="contained">Click</Button>` |
| Input | `<TextField>` | `<TextField label="Email" />` |
| Card | `<Card>` | `<Card><CardContent>...</CardContent></Card>` |
| Grid | `<Grid>` | `<Grid container spacing={2}><Grid item xs={12}> |
| Box | `<Box>` | `<Box sx={{p: 2, mb: 2}}>` |
| Texto | `<Typography>` | `<Typography variant="h5">Título</Typography>` |
| Alert | `<Alert>` | `<Alert severity="success">Sucesso!</Alert>` |
| Chip | `<Chip>` | `<Chip label="Tag" />` |
| AppBar | `<AppBar>` | `<AppBar position="sticky">` |
| Modal | `<Dialog>` | `<Dialog open={open}>` |

---

## 🎨 Customização com SX

### Padding & Spacing
```jsx
<Box sx={{
  p: 2,        // padding: 16px
  m: 1,        // margin: 8px
  mt: 2,       // margin-top: 16px
  px: 3,       // padding-left & right
  gap: 2,      // gap between flex items
}}/>
```

### Cores
```jsx
<Box sx={{
  color: 'primary.main',
  backgroundColor: 'background.paper',
  borderColor: 'divider',
}}/>
```

### Layout
```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 2,
}}/>
```

### Responsividade
```jsx
<Box sx={{
  fontSize: { xs: '12px', sm: '14px', md: '16px' },
  p: { xs: 1, sm: 2, md: 3 },
  display: { xs: 'block', md: 'flex' },
}}/>
```

### Hover & States
```jsx
<Button sx={{
  '&:hover': {
    backgroundColor: 'primary.dark',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}}/>
```

---

## 🎯 Atalhos de Tema

### Acessar Tema MUI
```jsx
import { useTheme } from '@mui/material/styles';

function Component() {
  const theme = useTheme();
  
  return (
    <Box sx={{
      color: theme.palette.primary.main,
      fontSize: theme.typography.body1.fontSize,
    }}>
      Content
    </Box>
  );
}
```

### Acessar Tema Solo Leveling
```jsx
import { useTheme } from './context/ThemeContext';

function Component() {
  const { themeName } = useTheme();
  
  return <div>Tema: {themeName}</div>;
}
```

---

## 🔧 Patterns Práticos

### 1. Card com Título e Botão
```jsx
<Card>
  <CardHeader title="Meu Card" />
  <CardContent>
    Conteúdo aqui
  </CardContent>
  <CardActions>
    <Button>Ação</Button>
  </CardActions>
</Card>
```

### 2. Grid Responsivo
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Coluna 1</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Coluna 2</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Coluna 3</Card>
  </Grid>
</Grid>
```

### 3. Formulário
```jsx
<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
  <TextField label="Nome" name="name" fullWidth margin="normal" />
  <TextField label="Email" type="email" fullWidth margin="normal" />
  <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
    Enviar
  </Button>
</Box>
```

### 4. Lista
```jsx
<List>
  <ListItem>
    <ListItemIcon><HomeIcon /></ListItemIcon>
    <ListItemText primary="Home" />
  </ListItem>
  <ListItem>
    <ListItemIcon><SettingsIcon /></ListItemIcon>
    <ListItemText primary="Settings" />
  </ListItem>
</List>
```

### 5. Notificação Toast
```jsx
import { Snackbar, Alert } from '@mui/material';

<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert onClose={handleClose} severity="success">
    Operação realizada com sucesso!
  </Alert>
</Snackbar>
```

---

## 📏 Breakpoints (Responsividade)

```
xs: 0px     (mobile)
sm: 600px   (tablet)
md: 900px   (small desktop)
lg: 1200px  (desktop)
xl: 1536px  (large desktop)
```

Usar em Grid, Display, etc:
```jsx
<Grid item xs={12} sm={6} md={4}>
  A largura muda conforme a tela
</Grid>

<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  Visível apenas em desktop
</Box>
```

---

## 🎨 Variantes de Componentes

### Button
- `variant="text"` - Texto puro
- `variant="outlined"` - Com borda
- `variant="contained"` - Preenchido (padrão)

### TextField
- `variant="outlined"` - Com borda (padrão)
- `variant="filled"` - Preenchido
- `variant="standard"` - Linha simples

### Cores
- `color="primary"`
- `color="secondary"`
- `color="success"`
- `color="warning"`
- `color="error"`
- `color="info"`

---

## 💡 Boas Práticas

✅ **DO**
- Use `fullWidth` em inputs de formulário
- Adicione `variant="outlined"` em inputs
- Use Grid para layouts responsivos
- Use sx prop para estilos inline simples
- Importe apenas o que precisa

❌ **DON'T**
- Não misture CSS classes com sx
- Não use !important em estilos
- Não crie componentes muito grands sem dividir
- Não esqueça de fechar Dialog/Modal
- Não use cores hardcoded (use tema)

---

## 🔗 Links Úteis

- [MUI Components](https://mui.com/material-ui/react-button/)
- [MUI Icons](https://mui.com/material-ui/material-icons/)
- [Emotion/SX](https://emotion.sh/docs/introduction)
- [Breakpoints](https://mui.com/material-ui/guides/responsive-ui-core/)

---

## 🐛 Erros Comuns

### Erro: "Cannot read property 'noContent'"
✅ Solução: Envolva componentes com `ThemeProvider` em App.js

### Erro: "Ícone não aparece"
✅ Solução: Importe do `@mui/icons-material` com novo nome:
```jsx
import { Home as HomeIcon } from '@mui/icons-material';
```

### Estilo não aplica
✅ Solução: Use `sx={{}}` ou `style={{}}`, não className puro

### Tema muda mas não atualiza
✅ Solução: Certifique que `MuiThemeProvider` está dentro de `ThemeProvider`

---

## 🚀 Próximos Passos

1. Converta uma página existente para MUI
2. Use nossos exemplo (GoalsPageExample, MuiExampleComponent)
3. Customize o tema para sua marca
4. Crie componentes reutilizáveis
5. Teste em diferentes telas (responsive)

---

**Desenvolvido para Solo Leveling - Sistema Gamificado de Progresso Pessoal**
