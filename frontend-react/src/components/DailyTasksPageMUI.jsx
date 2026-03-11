import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Menu,
  Checkbox,
  FormControlLabel,
  Tab,
  Tabs,
  Tab as MuiTab,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  CheckCircle,
  RadioButtonUnchecked,
  Flag,
  AccessTime,
  Warning,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Layout from './Layout';

// ====== TASK ITEM ======
const TaskListItem = ({ task, onComplete, onEdit, onDelete }) => {
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const priorityConfig = {
    high: { color: 'error', label: '🔴 Alta' },
    medium: { color: 'warning', label: '🟡 Média' },
    low: { color: 'success', label: '🟢 Baixa' },
  };

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        mb: 1,
        border: `1px solid ${muiTheme.palette.divider}`,
        background: task.completed
          ? muiTheme.palette.mode === 'dark'
            ? 'rgba(34, 255, 136, 0.08)'
            : 'rgba(34, 255, 136, 0.03)'
          : 'transparent',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 16px ${muiTheme.palette.primary.main}15`,
          background: task.completed
            ? muiTheme.palette.mode === 'dark'
              ? 'rgba(34, 255, 136, 0.12)'
              : 'rgba(34, 255, 136, 0.08)'
            : muiTheme.palette.action.hover,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Checkbox
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: '500',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.secondary' : 'text.primary',
              mb: 0.5,
            }}
          >
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {task.description}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
        {task.dueDate && (
          <Chip
            icon={<AccessTime />}
            label={task.dueDate}
            size="small"
            variant="outlined"
          />
        )}
        <Chip
          label={priorityConfig[task.priority].label}
          size="small"
          color={priorityConfig[task.priority].color}
          variant="filled"
        />
      </Box>

      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Deletar
        </MenuItem>
      </Menu>
    </Card>
  );
};

// ====== MAIN COMPONENT ======
export default function DailyTasksPageMUI() {
  const muiTheme = useMuiTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Reunião com o time', description: 'Standup às 10h', priority: 'high', dueDate: 'Hoje', completed: false },
    { id: 2, title: 'Revisar pull requests', description: '5 PRs pendentes', priority: 'high', dueDate: 'Hoje', completed: false },
    { id: 3, title: 'Escrever testes unitários', description: 'Cobertura > 80%', priority: 'medium', dueDate: 'Amanhã', completed: false },
    { id: 4, title: 'Atualizar documentação', description: 'README e CHANGELOG', priority: 'low', dueDate: 'Esta semana', completed: true },
    { id: 5, title: 'Deploy em staging', description: 'Feature X', priority: 'high', dueDate: 'Hoje', completed: false },
    { id: 6, title: 'Estudar TypeScript', description: 'Interfaces avançadas', priority: 'medium', dueDate: 'Amanhã', completed: true },
  ]);

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;

  const filteredTasks = tabValue === 0 ? tasks.filter(t => !t.completed) : tasks.filter(t => t.completed);

  const handleOpenDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...formData } : t));
    } else {
      setTasks([...tasks, { ...formData, id: Date.now(), completed: false }]);
    }
    handleCloseDialog();
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <Layout userName="Guilherme" userLevel={10}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                ✅ Minhas Tarefas
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {pendingCount} pendentes • {completedCount} completas hoje
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              size="large"
            >
              Nova Tarefa
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(255, 107, 53, 0.1)'
                    : 'rgba(255, 107, 53, 0.05)',
                  border: `1px solid rgba(255, 107, 53, 0.3)`,
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Warning sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {pendingCount}
                  </Typography>
                  <Typography variant="caption">Pendentes</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: muiTheme.palette.mode === 'dark'
                    ? 'rgba(34, 255, 136, 0.1)'
                    : 'rgba(34, 255, 136, 0.05)',
                  border: `1px solid rgba(34, 255, 136, 0.3)`,
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {completedCount}
                  </Typography>
                  <Typography variant="caption">Completas</Typography>
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
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {Math.round((completedCount / tasks.length) * 100)}%
                  </Typography>
                  <Typography variant="caption">Taxa de progresso</Typography>
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
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    3
                  </Typography>
                  <Typography variant="caption">Urgentes</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: `1px solid ${muiTheme.palette.divider}`,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: '500',
              },
            }}
          >
            <MuiTab label={`📋 Pendentes (${pendingCount})`} />
            <MuiTab label={`✅ Completas (${completedCount})`} />
          </Tabs>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                  {tabValue === 0 ? '🎉 Nenhuma tarefa pendente!' : 'Nenhuma tarefa completa ainda'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {tabValue === 0 && 'Crie uma nova tarefa para começar'}
                </Typography>
              </Box>
            ) : (
              <Box>
                {filteredTasks.map((task, index) => (
                  <Box key={task.id}>
                    <TaskListItem
                      task={task}
                      onComplete={handleCompleteTask}
                      onEdit={() => handleOpenDialog(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                    {index < filteredTasks.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingTask ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Descrição (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                label="Prioridade"
              >
                <MenuItem value="low">🟢 Baixa</MenuItem>
                <MenuItem value="medium">🟡 Média</MenuItem>
                <MenuItem value="high">🔴 Alta</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Data de vencimento"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              placeholder="Ex: Hoje, Amanhã, Esta semana"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSaveTask} variant="contained">
              {editingTask ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
