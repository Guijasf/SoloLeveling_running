import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, Chip, CircularProgress } from '@mui/material';
import api from '../utils/api';
import './MissionsCard.css';

function MissionsCard({ data }) {
  const [completedMissions, setCompletedMissions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const handleCompleteMission = async (missionId) => {
    setLoading(true);
    try {
      await api.post(`/missions/${missionId}/complete`);
      setCompletedMissions(new Set([...completedMissions, missionId]));
    } catch (err) {
      console.error('Erro ao completar missão:', err);
    } finally {
      setLoading(false);
    }
  };

  const missions = data?.today_missions || [];

  // Validar e limpar missões
  const validMissions = missions.filter(mission => {
    return mission &&
           typeof mission === 'object' &&
           mission.id !== undefined &&
           typeof mission.title === 'string';
  });

  return (
    <Card className="missions-card" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          🎯 Missões de Hoje
        </Typography>

        {missions.length === 0 ? (
          <Box className="empty-state" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>Nenhuma missão disponível</Typography>
          </Box>
        ) : (
          <Box className="missions-list">
            {validMissions.length === 0 ? (
              <Box className="empty-state" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography>Nenhuma missão válida disponível</Typography>
              </Box>
            ) : (
              validMissions.map((mission) => (
                <Box
                  key={mission.id}
                  className={`mission-item ${completedMissions.has(mission.id) ? 'completed' : ''}`}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    opacity: completedMissions.has(mission.id) ? 0.6 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <Box className="mission-info" sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {mission.title || 'Sem título'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {mission.description || 'Sem descrição'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={mission.difficulty || 'Normal'}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: getDifficultyColor(mission.difficulty),
                          borderColor: getDifficultyColor(mission.difficulty)
                        }}
                      />
                      <Chip
                        label={`+${mission.xp_reward || 0} XP`}
                        size="small"
                        color="success"
                        variant="filled"
                      />
                    </Stack>
                  </Box>
                  <Button
                    className="btn-complete"
                    variant="contained"
                    color={completedMissions.has(mission.id) ? 'success' : 'primary'}
                    onClick={() => handleCompleteMission(mission.id)}
                    disabled={completedMissions.has(mission.id) || loading}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    {completedMissions.has(mission.id) ? '✓ Completada' : 'Completar'}
                  </Button>
                </Box>
              ))
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function getDifficultyColor(difficulty) {
  const colors = {
    'Fácil': '#16c784',
    'Médio': '#ffd700',
    'Difícil': '#ff6666',
  };
  return colors[difficulty] || '#888';
}

export default MissionsCard;



