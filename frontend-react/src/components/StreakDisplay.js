import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Button, Grid, Stack, Paper, CircularProgress, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function StreakDisplay({ userId }) {
  const [streak, setStreak] = useState(null);
  const [bonus, setBonus] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadStreakData();
    }
  }, [userId]);

  const loadStreakData = async () => {
    try {
      setLoading(true);
      const [streakRes, bonusRes, leaderboardRes] = await Promise.all([
        axios.get(`${API_URL}/streak/${userId}`),
        axios.get(`${API_URL}/streak/${userId}/bonus`),
        axios.get(`${API_URL}/streak/${userId}/leaderboard`)
      ]);
      setStreak(streakRes.data);
      setBonus(bonusRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (error) {
      console.error('Erro ao carregar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        🔥 Seu Streak
      </Typography>

      {streak && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                  {streak.display.badge}
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                  {streak.current_streak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  DIAS
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  {streak.display.level}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack spacing={2}>
              <DetailRow label="💪 Melhor Streak" value={`${streak.best_streak} dias`} />
              <DetailRow label="⚡ XP Multiplier" value={`${streak.multiplier}x`} />
              <DetailRow label="📅 Última Atividade" value={streak.last_activity} />
            </Stack>
          </Grid>
        </Grid>
      )}

      {bonus && (
        <Card sx={{ mb: 3, borderRadius: 2, borderLeft: '4px solid #FACC15' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              💰 Bonus Ativo
            </Typography>
            <DetailRow label="XP Extra" value={`+${bonus.bonus_xp}`} />
            <DetailRow label="Multiplicador" value={`${bonus.multiplier}x`} />

            {bonus.milestone && bonus.milestone.milestone_reached && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  🎉 {bonus.milestone.message}
                </Typography>
                <Typography variant="caption">
                  Você desbloqueou +{bonus.milestone.bonus_xp} XP!
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {leaderboard && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🏆 Leaderboard Top 10
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
              {leaderboard.leaderboard.map((user, idx) => {
                const bgColor =
                  idx === 0
                    ? 'warning.light'
                    : idx === 1
                      ? 'info.light'
                      : idx === 2
                        ? 'error.light'
                        : 'action.hover';

                return (
                  <Paper
                    key={idx}
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: bgColor,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      #{user.position}
                    </Typography>
                    <Typography variant="body2">{user.badge}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.streak} dias
                    </Typography>
                  </Paper>
                );
              })}
            </Stack>

            {leaderboard.user_position && (
              <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Sua Posição:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    #{leaderboard.user_position.position}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {leaderboard.user_position.streak} dias
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Button onClick={loadStreakData} variant="contained" fullWidth sx={{ mt: 2 }}>
        🔄 Atualizar
      </Button>
    </Box>
  );
}

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Box>
);
