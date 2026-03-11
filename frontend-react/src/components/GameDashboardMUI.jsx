import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Whatshot as WhatshotIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Psychology as BrainIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Layout from './Layout';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Componente: StatCard
 * Card para exibir estatísticas
 */
function StatCard({ title, value, icon: Icon, color = 'primary', unit = '' }) {
  const muiTheme = useMuiTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>
          <Icon color={color} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
          {unit && <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>{unit}</Typography>}
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * Componente: ProgressCard
 * Card com barra de progresso
 */
function ProgressCard({ title, current, target, emoji = '' }) {
  const percentage = target ? Math.min((current / target) * 100, 100) : 0;
  const muiTheme = useMuiTheme();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h5">{emoji}</Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {current} / {target}
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 1,
            backgroundColor: muiTheme.palette.action.hover,
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
          {Math.round(percentage)}%
        </Typography>
      </CardContent>
    </Card>
  );
}

/**
 * Componente: GameDashboardMUI
 * Dashboard principal convertido para MUI
 */
function GameDashboardMUI() {
  const muiTheme = useMuiTheme();
  const [userId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/public/users/${userId}`).catch(() => ({
        data: {
          username: 'Jogador',
          level: 10,
          current_xp: 1415,
          next_level_xp: 2700,
        },
      }));
      setUserData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setUserData({
        username: 'Jogador',
        level: 10,
        current_xp: 1415,
        next_level_xp: 2700,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout userName={userData?.username} userLevel={userData?.level}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            ⚔️ Dashboard
          </Typography>
          <Chip
            icon={<StarIcon />}
            label={`Nível ${userData?.level}`}
            color="primary"
            variant="filled"
          />
        </Box>
        <Typography variant="body1" color="textSecondary">
          Bem-vindo, {userData?.username}! Acompanhe sua evolução neste RPG de vida real.
        </Typography>
      </Box>

      {notification && (
        <Alert severity={notification.type} onClose={() => setNotification(null)} sx={{ mb: 3 }}>
          {notification.message}
        </Alert>
      )}

      {/* Overview Tab */}
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="📊 Overview" />
        <Tab label="🎯 Metas" />
        <Tab label="🎮 Missões" />
        <Tab label="🔥 Sequência" />
      </Tabs>

      {activeTab === 0 && (
        <>
          {/* XP Progress */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}20, ${muiTheme.palette.secondary.main}20)`,
                  borderRadius: 2,
                  border: `1px solid ${muiTheme.palette.primary.main}40`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ⚡ Experiência (XP)
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                    {userData?.current_xp} / {userData?.next_level_xp}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(userData?.current_xp / userData?.next_level_xp) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 1,
                    backgroundColor: muiTheme.palette.action.hover,
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(90deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.success.main})`,
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Nível"
                value={userData?.level}
                icon={StarIcon}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Sequência Ativa"
                value="15"
                unit="dias"
                icon={WhatshotIcon}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Metas Completas"
                value="8"
                icon={TrophyIcon}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pontos de Vida"
                value="95"
                unit="%"
                icon={BrainIcon}
                color="info"
              />
            </Grid>
          </Grid>

          {/* Progress Cards */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            📈 Progresso nas Metas
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ProgressCard
                title="Perder 10kg"
                current={81}
                target={100}
                emoji="⚖️"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ProgressCard
                title="Reserva Financeira"
                current={8058}
                target={10000}
                emoji="💰"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ProgressCard
                title="Estudar React"
                current={45}
                target={100}
                emoji="📚"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ProgressCard
                title="Treinos por Semana"
                current={4}
                target={5}
                emoji="💪"
              />
            </Grid>
          </Grid>

          {/* Tips Card */}
          <Card>
            <CardHeader title="📖 Como Jogar" />
            <CardContent>
              <Box component="ul" sx={{ ml: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ⭐ Complete metas para ganhar XP
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  🎮 Realize missões diárias para bônus
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  🔥 Mantenha sua sequência ativa (multiplicador até 1.5x)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  🏆 Suba de nível e desbloqueie conquistas
                </Typography>
                <Typography component="li" variant="body2">
                  💰 Ganhe XP em diferentes áreas de vida
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6">🎯 Seção de Metas</Typography>
            <Typography variant="body2" color="textSecondary">
              Funcionalidade em desenvolvimento...
            </Typography>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6">🎮 Seção de Missões</Typography>
            <Typography variant="body2" color="textSecondary">
              Funcionalidade em desenvolvimento...
            </Typography>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6">🔥 Seção de Sequência</Typography>
            <Typography variant="body2" color="textSecondary">
              Funcionalidade em desenvolvimento...
            </Typography>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}

export default GameDashboardMUI;
