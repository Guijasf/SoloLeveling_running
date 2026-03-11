import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  EmptyResult,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Layout from './Layout';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Componente: GoalCard
 * Card para exibir uma meta individual
 */
function GoalCard({ goal, onEdit, onDelete }) {
  const muiTheme = useMuiTheme();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const progress = Math.min(goal.progress || 0, 100);
  const isCompleted = goal.status === 'completed';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isCompleted ? 0.7 : 1,
        border: isCompleted ? `2px solid ${muiTheme.palette.success.main}` : undefined,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Typography variant="h5" sx={{ m: 0 }}>
            {goal.emoji || '🎯'}
          </Typography>
        }
        title={goal.name}
        subheader={goal.category || 'Meta'}
        action={
          <>
            <IconButton
              size="small"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              <MenuItem onClick={() => {
                onEdit(goal);
                setMenuAnchor(null);
              }}>
                <EditIcon sx={{ mr: 1 }} fontSize="small" />
                Editar
              </MenuItem>
              <MenuItem onClick={() => {
                onDelete(goal.id);
                setMenuAnchor(null);
              }}>
                <DeleteIcon sx={{ mr: 1, color: 'error.main' }} fontSize="small" />
                Deletar
              </MenuItem>
            </Menu>
          </>
        }
        sx={{ pb: 1 }}
      />

      {/* Content */}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {goal.description}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="textSecondary">
              Progresso
            </Typography>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: muiTheme.palette.action.hover,
            }}
          />
        </Box>

        {/* Metadata */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {goal.daysLeft && (
            <Chip
              label={`${goal.daysLeft} dias`}
              size="small"
              variant="outlined"
            />
          )}
          {isCompleted && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Completo"
              size="small"
              color="success"
              variant="filled"
            />
          )}
          {progress >= 80 && !isCompleted && (
            <Chip
              label="🔥 Quase lá!"
              size="small"
              color="warning"
              variant="filled"
            />
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions>
        <Button size="small" color="primary">
          Registrar Progresso
        </Button>
      </CardActions>
    </Card>
  );
}

/**
 * GoalsPageMUI
 * Página de Metas convertida para MUI
 */
function GoalsPageMUI() {
  const muiTheme = useMuiTheme();
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Perder 10kg',
      description: 'Atingir 72kg de peso ideal',
      emoji: '⚖️',
      category: 'Saúde',
      progress: 81,
      daysLeft: 45,
      status: 'in_progress',
    },
    {
      id: 2,
      name: 'Poupar R$10k',
      description: 'Criar uma reserva de emergência',
      emoji: '💰',
      category: 'Finanças',
      progress: 88,
      daysLeft: 30,
      status: 'in_progress',
    },
    {
      id: 3,
      name: 'Ler 12 livros',
      description: 'Um livro por mês',
      emoji: '📚',
      category: 'Aprendizado',
      progress: 25,
      daysLeft: 90,
      status: 'in_progress',
    },
    {
      id: 4,
      name: 'Treinar 3x por semana',
      description: 'Manter rotina de exercícios',
      emoji: '💪',
      category: 'Saúde',
      progress: 100,
      daysLeft: 0,
      status: 'completed',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({ name: goal.name, description: goal.description });
    } else {
      setEditingGoal(null);
      setFormData({ name: '', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
    setFormData({ name: '', description: '' });
  };

  const handleSaveGoal = () => {
    if (formData.name.trim()) {
      if (editingGoal) {
        // Atualizar meta existente
        setGoals(goals.map(g =>
          g.id === editingGoal.id
            ? { ...g, name: formData.name, description: formData.description }
            : g
        ));
      } else {
        // Criar nova meta
        setGoals([...goals, {
          id: Date.now(),
          name: formData.name,
          description: formData.description,
          emoji: '🎯',
          category: 'Geral',
          progress: 0,
          daysLeft: 30,
          status: 'in_progress',
        }]);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const activeGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <Layout>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            🎯 Metas
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Defina e acompanhe seus objetivos pessoais
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Nova Meta
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{ mb: 3, borderBottom: `1px solid ${muiTheme.palette.divider}` }}
      >
        <Tab label={`📊 Ativas (${activeGoals.length})`} />
        <Tab label={`✅ Completas (${completedGoals.length})`} />
      </Tabs>

      {/* Metas Ativas */}
      {activeTab === 0 && (
        <>
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  📭 Nenhuma meta ativa
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Crie sua primeira meta para começar sua jornada!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Criar Meta Agora
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {activeGoals.map(goal => (
                <Grid item xs={12} sm={6} md={4} key={goal.id}>
                  <GoalCard
                    goal={goal}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteGoal}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Metas Completas */}
      {activeTab === 1 && (
        <>
          {completedGoals.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
                  🎉 Ainda não há metas completas
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Complete suas metas ativas para vê-las aqui!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {completedGoals.map(goal => (
                <Grid item xs={12} sm={6} md={4} key={goal.id}>
                  <GoalCard
                    goal={goal}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteGoal}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Dialog - Criar/Editar Meta */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? '✏️ Editar Meta' : '🎯 Criar Nova Meta'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nome da Meta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Perder 10kg"
            margin="normal"
            autoFocus
          />
          <TextField
            fullWidth
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalhe sobre a meta"
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveGoal}
            variant="contained"
            color="primary"
          >
            {editingGoal ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default GoalsPageMUI;
