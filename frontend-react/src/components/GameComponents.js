import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  Stack, 
  Paper, 
  FormControl, 
  InputLabel, 
  Chip, 
  LinearProgress, 
  CircularProgress,
  Alert 
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ==================== GOALS COMPONENT ====================
export const GoalsComponent = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'other',
    target_value: '',
    priority: 3,
    reward_xp: 100,
    user_id: userId
  });

  useEffect(() => {
    loadGoals();
    loadStats();
  }, [userId]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${userId}/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    }
  };

  const createGoal = async () => {
    try {
      await axios.post(`${API_URL}/goals`, newGoal);
      setNewGoal({
        title: '',
        description: '',
        category: 'other',
        target_value: '',
        priority: 3,
        reward_xp: 100,
        user_id: userId
      });
      setShowForm(false);
      loadGoals();
      loadStats();
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  };

  const completeGoal = async (goalId) => {
    try {
      await axios.post(`${API_URL}/goals/${userId}/${goalId}/complete`);
      loadGoals();
      loadStats();
    } catch (error) {
      console.error('Erro ao completar meta:', error);
    }
  };

  const categoryEmoji = {
    financial: '💰',
    weight: '⚖️',
    habit: '🔄',
    career: '💼',
    health: '💪',
    relationships: '❤️',
    learning: '📚',
    other: '🎯'
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        🎯 Minhas Metas
      </Typography>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Total', value: stats.total_goals },
            { label: 'Completas', value: stats.completed_goals },
            { label: 'Taxa', value: `${stats.completion_rate}%` },
            { label: 'XP Ganho', value: `+${stats.total_xp_earned}` }
          ].map((stat, idx) => (
            <Grid item xs={6} sm={3} key={idx}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Button
        variant="contained"
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
        fullWidth
      >
        {showForm ? 'Cancelar' : '+ Nova Meta'}
      </Button>

      {showForm && (
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Título da meta"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Descrição"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={newGoal.category}
                  label="Categoria"
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                >
                  <MenuItem value="other">Outro</MenuItem>
                  <MenuItem value="financial">Financeiro</MenuItem>
                  <MenuItem value="weight">Peso</MenuItem>
                  <MenuItem value="habit">Hábito</MenuItem>
                  <MenuItem value="career">Carreira</MenuItem>
                  <MenuItem value="health">Saúde</MenuItem>
                  <MenuItem value="relationships">Relacionamentos</MenuItem>
                  <MenuItem value="learning">Aprendizado</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="number"
                label="Meta (ex: 5000 ou 75kg)"
                value={newGoal.target_value}
                onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Prioridade: {newGoal.priority}/5
                </Typography>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </Box>
              <Button variant="contained" color="success" onClick={createGoal}>
                Criar Meta
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : goals.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">Nenhuma meta ainda. Crie sua primeira!</Alert>
          </Grid>
        ) : (
          goals.map((goal) => (
            <Grid item xs={12} key={goal.id}>
              <Card sx={{ borderLeft: `4px solid ${goal.status === 'completed' ? '#22C55E' : '#3B82F6'}`, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {categoryEmoji[goal.category]} {goal.title}
                    </Typography>
                    <Chip label={`+${goal.reward_xp} XP`} color="success" size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {goal.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={goal.target_value ? (goal.current_progress / goal.target_value) * 100 : 0}
                      sx={{ mb: 1, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {goal.current_progress} / {goal.target_value || 'N/A'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={goal.status}
                      variant="outlined"
                      color={goal.status === 'completed' ? 'success' : 'default'}
                      size="small"
                    />
                    {goal.status !== 'completed' && (
                      <Button size="small" variant="contained" color="success" onClick={() => completeGoal(goal.id)}>
                        ✓ Completar
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

// ==================== STREAK COMPONENT ====================
export const StreakComponent = ({ userId }) => {
  const [streak, setStreak] = useState(null);
  const [bonus, setBonus] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreak();
  }, [userId]);

  const loadStreak = async () => {
    try {
      setLoading(true);
      const [streakRes, bonusRes, boardRes] = await Promise.all([
        axios.get(`${API_URL}/streak/${userId}`),
        axios.get(`${API_URL}/streak/${userId}/bonus`),
        axios.get(`${API_URL}/streak/${userId}/leaderboard`)
      ]);

      setStreak(streakRes.data);
      setBonus(bonusRes.data);
      setLeaderboard(boardRes.data.leaderboard);
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !streak) return <CircularProgress />;

  const display = streak.display || {};

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        🔥 Sua Sequência
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h3" sx={{ mb: 1 }}>
                {display.badge}
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                {streak.current_streak}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Dias
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {display.level}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={2}>
            <DetailRow label="Melhor Série" value={`${streak.best_streak} dias`} />
            <DetailRow label="Nível" value={display.level} />
            <DetailRow label="Multiplicador XP" value={`${display.xp_multiplier}x`} />
            {bonus && (
              <>
                <DetailRow label="Bônus XP Ativo" value={`+${bonus.bonus_xp} XP`} />
                {bonus.milestone && bonus.milestone.milestone_reached && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    <Typography variant="body2">🎉 {bonus.milestone.message}</Typography>
                  </Alert>
                )}
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      {leaderboard.length > 0 && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🏆 Top 10
            </Typography>
            <Stack spacing={1}>
              {leaderboard.map((entry, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: entry.user_id === userId ? 'primary.light' : 'action.hover',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    #{entry.position}
                  </Typography>
                  <Typography variant="body2">{entry.badge}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {entry.streak} dias
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// ==================== MISSIONS COMPONENT ====================
export const MissionsComponent = ({ userId }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyStats, setDailyStats] = useState(null);

  useEffect(() => {
    loadMissions();
    loadDailyStats();
  }, [userId]);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/missions/${userId}`);
      setMissions(response.data);
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/missions/${userId}/process-today`);
      setDailyStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    }
  };

  const completeMission = async (missionId) => {
    try {
      await axios.post(`${API_URL}/missions/${missionId}/complete`);
      loadMissions();
      loadDailyStats();
    } catch (error) {
      console.error('Erro ao completar missão:', error);
    }
  };

  const areaColor = {
    Health: '#22C55E',
    Career: '#3B82F6',
    Finance: '#FACC15',
    Relationships: '#FF6B6B',
    Mind: '#8B5CF6'
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        🎮 Missões do Dia
      </Typography>

      {dailyStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Completadas', value: `${dailyStats.missions_completed}/${dailyStats.missions_today}` },
            { label: 'Taxa', value: `${dailyStats.completion_rate}%` },
            { label: 'XP Total', value: `+${dailyStats.total_xp_with_bonus}` }
          ].map((stat, idx) => (
            <Grid item xs={6} sm={4} key={idx}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={2}>
        {loading ? (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        ) : missions.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">Nenhuma missão gerada ainda. Complete uma métrica para gerar!</Alert>
          </Grid>
        ) : (
          missions.map((mission) => (
            <Grid item xs={12} sm={6} md={4} key={mission.id}>
              <Card
                sx={{
                  opacity: mission.completed ? 0.6 : 1,
                  borderRadius: 2,
                  borderLeft: `4px solid ${areaColor[mission.area_name] || '#666'}`
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {mission.title}
                    </Typography>
                    <Chip label={`+${mission.xp_reward} XP`} size="small" color="warning" />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                    {mission.description}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <Chip
                      label={mission.area_name}
                      size="small"
                      sx={{
                        backgroundColor: areaColor[mission.area_name] || '#666',
                        color: '#fff'
                      }}
                    />
                    <Chip
                      label={
                        mission.difficulty === 'easy'
                          ? '⭐'
                          : mission.difficulty === 'medium'
                            ? '⭐⭐'
                            : '⭐⭐⭐'
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  {!mission.completed && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => completeMission(mission.id)}
                      fullWidth
                      size="small"
                    >
                      ✓ Completada
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

// ==================== STATISTICS COMPONENT ====================
export const StatisticsComponent = ({ userId }) => {
  const [stats, setStats] = useState([
    { label: 'Total XP', value: 0, icon: '⭐' },
    { label: 'Nível', value: 0, icon: '🎮' },
    { label: 'Rank', value: 'E', icon: '🏆' },
    { label: 'Streak', value: 0, icon: '🔥' }
  ]);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const streakRes = await axios.get(`${API_URL}/streak/${userId}`);
      const data = streakRes.data;

      setStats([
        { label: 'Total XP', value: 0, icon: '⭐', color: '#3B82F6' },
        { label: 'Nível', value: 0, icon: '🎮', color: '#8B5CF6' },
        { label: 'Rank', value: 'C', icon: '🏆', color: '#FACC15' },
        { label: 'Streak', value: `${data.current_streak} dias`, icon: '🔥', color: '#FF6B6B' }
      ]);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Estatísticas
      </Typography>
      <Grid container spacing={2}>
        {stats.map((stat, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card sx={{ textAlign: 'center', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {stat.icon}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Box>
);
