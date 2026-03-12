import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Tooltip, Paper } from '@mui/material';
import './AchievementsCard.css';

const ACHIEVEMENT_ICONS = {
  'streak_7': { icon: '🔥', name: '7 Dias de Fogo' },
  'xp_1000': { icon: '⭐', name: '1000 XP' },
  'rank_b': { icon: '🐉', name: 'Mestria' },
  'perfect_week': { icon: '✨', name: 'Semana Perfeita' },
  'level_10': { icon: '🏆', name: 'Nível 10' },
};

function AchievementsCard({ data }) {
  // Garantir que achievements é um array
  let achievements = [];

  if (data?.achievements) {
    if (Array.isArray(data.achievements)) {
      achievements = data.achievements;
    } else if (typeof data.achievements === 'object') {
      // Se for um objeto, converter para array
      achievements = Object.values(data.achievements);
    }
  }

  return (
    <Card className="achievements-card" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          🏆 Conquistas
        </Typography>

        {achievements.length === 0 ? (
          <Box className="empty-state" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">
              Comece a completar missões para desbloquear conquistas!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} className="achievements-grid">
            {achievements.map((achievement, idx) => {
              // Garantir que achievement é um objeto válido
              if (!achievement || typeof achievement !== 'object') {
                return null;
              }

              const achievementId = achievement.id || idx;
              const achievementKey = achievement.key || 'default';
              const info = ACHIEVEMENT_ICONS[achievementKey] || {
                icon: '🎯',
                name: achievement.name || 'Conquista'
              };

              return (
                <Tooltip key={achievementId} title={info.name} placement="top">
                  <Paper
                    className="achievement-item"
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Box className="achievement-icon" sx={{ fontSize: '32px', mb: 1 }}>
                      {info.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      className="achievement-name"
                      sx={{ textAlign: 'center', fontSize: '12px', fontWeight: '500' }}
                    >
                      {info.name}
                    </Typography>
                  </Paper>
                </Tooltip>
              );
            })}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}

export default AchievementsCard;


