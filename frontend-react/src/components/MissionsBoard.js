import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Grid, Typography, Button, Chip, Stack, Paper, CircularProgress, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function MissionsBoard({ userId }) {
  const [missions, setMissions] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadMissions();
      loadTodayStats();
    }
  }, [userId]);

  const loadMissions = async () => {
    try {
      const response = await axios.get(`${API_URL}/missions/${userId}`);
      setMissions(response.data);
    } catch (error) {
      console.error('Erro ao carregar missões:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/missions/${userId}/process-today`);
      setTodayStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId) => {
    try {
      await axios.post(`${API_URL}/missions/${missionId}/complete`);
      loadMissions();
      loadTodayStats();
      alert('✅ Missão completada!');
    } catch (error) {
      console.error('Erro ao completar missão:', error);
      alert('Erro: ' + error.response?.data?.detail || error.message);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#22C55E',
      medium: '#3B82F6',
      hard: '#EF4444'
    };
    return colors[difficulty] || '#999';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: '⭐ Fácil',
      medium: '⭐⭐ Médio',
      hard: '⭐⭐⭐ Difícil'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        🎮 Missões do Dia
      </Typography>

      {todayStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {todayStats.missions_completed}/{todayStats.missions_today}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completadas
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {todayStats.completion_rate}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Taxa Conclusão
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {todayStats.total_xp_with_bonus}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                XP Total
              </Typography>
            </Paper>
          </Grid>
          {todayStats.bonus_streak > 0 && (
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  +{todayStats.bonus_streak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Bônus Streak
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : missions.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">Nenhuma missão para hoje.</Alert>
          </Grid>
        ) : (
          missions.map((mission) => (
            <Grid item xs={12} sm={6} md={4} key={mission.id}>
              <Card
                sx={{
                  opacity: mission.completed ? 0.6 : 1,
                  transition: 'all 0.2s',
                  borderRadius: 2
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {mission.title}
                    </Typography>
                    <Chip
                      label={getDifficultyLabel(mission.difficulty)}
                      size="small"
                      sx={{
                        backgroundColor: getDifficultyColor(mission.difficulty),
                        color: '#fff',
                        ml: 1
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {mission.description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <Chip label={`📍 ${mission.area_name}`} size="small" variant="outlined" />
                    <Chip label={`⭐ ${mission.xp_reward} XP`} size="small" color="warning" />
                  </Stack>

                  {mission.target_metric_value && (
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1, mb: 1.5 }}>
                      <Typography variant="caption">
                        🎯 Meta: {mission.target_metric_value}
                      </Typography>
                    </Box>
                  )}

                  {!mission.completed ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => completeMission(mission.id)}
                      fullWidth
                      size="small"
                    >
                      ✅ Completar
                    </Button>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 1, bgcolor: 'success.lighter', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                        ✓ Completada
                      </Typography>
                    </Box>
                  )}

                  {mission.reason && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      ℹ️ {mission.reason}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Button
        variant="contained"
        onClick={() => {
          loadMissions();
          loadTodayStats();
        }}
        fullWidth
      >
        🔄 Atualizar
      </Button>
    </Box>
  );
}
