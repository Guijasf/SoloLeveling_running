import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  CheckCircle,
  RadioButtonUnchecked,
  TrendingUp,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Layout from './Layout';

// ====== HABIT CARD ======
const HabitCard = ({ name, emoji, frequency, progress, color, onEdit, onDelete }) => {
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        background: muiTheme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${color}20, ${color}10)`
          : `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `2px solid ${color}40`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${color}30`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 32 }}>{emoji}</Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {frequency} vezes por semana
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        {/* Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Editar
          </MenuItem>
          <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Deletar
          </MenuItem>
        </Menu>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: '500' }}>
              Progresso
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              background: muiTheme.palette.action.disabled,
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${color}, ${color}99)`,
              },
            }}
          />
        </Box>

        {/* Stats */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box sx={{ p: 1, background: muiTheme.palette.action.hover, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Semanas
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                8
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 1, background: muiTheme.palette.action.hover, borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Sequência
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color }}>
                5
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// ====== MAIN COMPONENT ======
export default function HabitsPageMUI() {
  const muiTheme = useMuiTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({ name: '', emoji: '', frequency: '' });

  const [habits, setHabits] = useState([
    { id: 1, name: 'Correr', emoji: '🏃', frequency: 3, progress: 80, color: '#22ff88' },
    { id: 2, name: 'Ler', emoji: '📚', frequency: 5, progress: 65, color: '#3b82f6' },
    { id: 3, name: 'Meditar', emoji: '🧘', frequency: 7, progress: 45, color: '#8b5cf6' },
    { id: 4, name: 'Código', emoji: '💻', frequency: 6, progress: 90, color: '#00d9ff' },
    { id: 5, name: 'Cozinhar', emoji: '👨‍🍳', frequency: 4, progress: 70, color: '#ff6b35' },
    { id: 6, name: 'Socializar', emoji: '👥', frequency: 3, progress: 55, color: '#ff006e' },
  ]);

  const handleOpenDialog = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({ name: habit.name, emoji: habit.emoji, frequency: habit.frequency });
    } else {
      setEditingHabit(null);
      setFormData({ name: '', emoji: '', frequency: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingHabit(null);
  };

  const handleSaveHabit = () => {
    if (editingHabit) {
      setHabits(habits.map(h => h.id === editingHabit.id ? { ...editingHabit, ...formData } : h));
    } else {
      setHabits([...habits, { ...formData, id: Date.now(), progress: 50, color: '#3b82f6' }]);
    }
    handleCloseDialog();
  };

  const handleDeleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <Layout userName="Guilherme" userLevel={10}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                🌟 Meus Hábitos
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {habits.length} hábitos em progresso • Mantenha a consistência
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              size="large"
            >
              Novo Hábito
            </Button>
          </Box>

          {/* Stats Summary */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(34, 255, 136, 0.1)'
                    : 'rgba(34, 255, 136, 0.05)',
                  border: `1px solid rgba(34, 255, 136, 0.3)`,
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {habits.length}
                  </Typography>
                  <Typography variant="caption">Hábitos ativos</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'rgba(59, 130, 246, 0.05)',
                  border: `1px solid rgba(59, 130, 246, 0.3)`,
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    72%
                  </Typography>
                  <Typography variant="caption">Progresso médio</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(255, 107, 53, 0.1)'
                    : 'rgba(255, 107, 53, 0.05)',
                  border: `1px solid rgba(255, 107, 53, 0.3)`,
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                    23
                  </Typography>
                  <Typography variant="caption">Melhor sequência</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(139, 92, 246, 0.1)'
                    : 'rgba(139, 92, 246, 0.05)',
                  border: `1px solid rgba(139, 92, 246, 0.3)`,
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    15
                  </Typography>
                  <Typography variant="caption">Dias consecutivos</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Habits Grid */}
        <Grid container spacing={3}>
          {habits.map((habit) => (
            <Grid item xs={12} sm={6} md={4} key={habit.id}>
              <HabitCard
                name={habit.name}
                emoji={habit.emoji}
                frequency={habit.frequency}
                progress={habit.progress}
                color={habit.color}
                onEdit={() => handleOpenDialog(habit)}
                onDelete={() => handleDeleteHabit(habit.id)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingHabit ? '✏️ Editar Hábito' : '➕ Novo Hábito'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Nome do hábito"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Emoji (ex: 🏃, 📚)"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Dias por semana (1-7)"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSaveHabit} variant="contained">
              {editingHabit ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
