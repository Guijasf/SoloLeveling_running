import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, Stack, Paper } from '@mui/material';
import SafeRender from './SafeRender';
import './ProfileCard.css';

const RANK_COLORS = {
  'E': { emoji: '🌱', name: 'Novato', color: '#888' },
  'D': { emoji: '⚔️', name: 'Aprendiz', color: '#16c784' },
  'C': { emoji: '🛡️', name: 'Guerreiro', color: '#00d4ff' },
  'B': { emoji: '🐉', name: 'Mestre', color: '#ffd700' },
  'A': { emoji: '⭐', name: 'Lendário', color: '#ff6b9d' },
  'S': { emoji: '👑', name: 'Deus', color: '#ff00ff' }
};

function ProfileCard({ data }) {
  if (!data) {
    return <Paper className="profile-card loading" sx={{ p: 2 }}>Carregando perfil...</Paper>;
  }

  // Verificar se dados estão válidos
  const level = data?.level || 1;
  const rank = data?.rank || 'E';
  const xp = data?.xp || 0;
  const nextLevelXp = data?.next_level_xp || 100;
  const streak = data?.streak || 0;
  const achievementsCount = data?.achievements_count || 0;
  const lifeScore = data?.life_score || 0;
  const focusArea = data?.focus_area || null;
  const profileName = data?.profile_name || data?.name || 'Usuário';

  const rankInfo = RANK_COLORS[rank] || RANK_COLORS['E'];
  const xpPercent = (xp / nextLevelXp) * 100;

  return (
    <Card className="profile-card" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box className="profile-header" sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box
            className="profile-avatar"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Typography
              className="level-badge"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#ffd700',
                color: '#000',
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {level}
            </Typography>
          </Box>

          <Box className="profile-info" sx={{ flex: 1 }}>
            <Typography variant="h5" className="profile-name" sx={{ mb: 1, fontWeight: 'bold' }}>
              <SafeRender value={profileName} fallback="Usuário" />
            </Typography>
            <Paper
              variant="outlined"
              className="rank-badge"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderColor: rankInfo.color,
                borderWidth: 2
              }}
            >
              <Typography className="rank-emoji" sx={{ fontSize: '20px' }}>
                {rankInfo.emoji}
              </Typography>
              <Typography className="rank-name" variant="body2">
                {rankInfo.name}
              </Typography>
              <Typography className="rank-letter" variant="body2" sx={{ fontWeight: 'bold' }}>
                <SafeRender value={rank} fallback="E" />
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box className="xp-bar" sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={xpPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          />
          <Typography variant="caption" className="xp-text" sx={{ display: 'block', textAlign: 'center' }}>
            {xp} / {nextLevelXp} XP
          </Typography>
        </Box>

        <Grid container spacing={1} className="stats-grid">
          <StatItem icon="🔥" label="Streak" value={streak} />
          <StatItem icon="🏆" label="Conquistas" value={achievementsCount} />
          <StatItem icon="📊" label="Life Score" value={Math.round(lifeScore)} />
        </Grid>

        {focusArea && (
          <Box className="focus-section" sx={{ mt: 2, p: 1.5, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" className="focus-label" sx={{ fontWeight: 'bold' }}>
              📍 Foco Semanal:
            </Typography>
            <Typography variant="body1" className="focus-value">
              {focusArea}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

const StatItem = ({ icon, label, value }) => (
  <Box className="stat" sx={{ flex: '1 0 calc(33.333% - 8px)', textAlign: 'center' }}>
    <Typography variant="body2" sx={{ fontSize: '18px', mb: 0.5 }}>
      {icon}
    </Typography>
    <Typography variant="caption" className="stat-label" sx={{ display: 'block', fontSize: '11px' }}>
      {label}
    </Typography>
    <Typography variant="body2" className="stat-value" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
      <SafeRender value={value} fallback="0" />
    </Typography>
  </Box>
);

// Simple Grid component replacement
const Grid = ({ container, spacing, children, className }) => (
  <Box className={className} sx={{ display: 'flex', gap: spacing ? spacing * 8 : 0, flexWrap: 'wrap' }}>
    {children}
  </Box>
);

export default ProfileCard;






