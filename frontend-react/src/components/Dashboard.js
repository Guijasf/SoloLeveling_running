import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, AppBar, Toolbar, Typography, Button, Stack, Grid, Paper, CircularProgress, LinearProgress, Tabs, Tab } from '@mui/material';
import GoalsManager from './GoalsManager';
import StreakDisplay from './StreakDisplay';
import MissionsBoard from './MissionsBoard';
import AreaScoringChart from './AreaScoringChart';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [userSettings, setUserSettings] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Buscar dados do usuário armazenados no localStorage ou fazer login padrão
      const userId = localStorage.getItem('userId') || '1';
      
      const userResponse = await axios.get(`${API_URL}/users/${userId}`);
      const progressResponse = await axios.get(`${API_URL}/progress/${userId}/overall`);

      setUser(userResponse.data);
      setProgress(progressResponse.data);

      // Carregar configurações se existirem
      try {
        const settingsResponse = await axios.get(`${API_URL}/users/${userId}/settings`);
        setUserSettings(settingsResponse.data);
      } catch (error) {
        console.log('Configurações não disponíveis ainda');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Usar dados padrão se não conseguir carregar
      setUser({ id: '1', username: 'Jogador', level: 1 });
      setProgress({ current_xp: 0, level: 1, rank: 'Iniciante', total_followers: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando seu progresso...</Typography>
      </Box>
    );
  }

  const userId = user?.id || '1';

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              🎮 Solo Leveling
            </Typography>
            {user && (
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {user?.username || 'Jogador'}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  <Typography variant="caption">
                    Nível {progress?.level || 1}
                  </Typography>
                  <Typography variant="caption">
                    🏅 {progress?.rank || 'Iniciante'}
                  </Typography>
                </Stack>
              </Paper>
            )}
          </Box>
          <Button
            color="inherit"
            onClick={loadUserData}
            sx={{ ml: 2 }}
          >
            🔄 Atualizar
          </Button>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Paper sx={{ borderRadius: 0 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tab label="📊 Visão Geral" />
          <Tab label="🎮 Missões" />
          <Tab label="🎯 Metas" />
          <Tab label="🔥 Sequência" />
          <Tab label="📍 Áreas" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Box component="main" sx={{ flex: 1, py: 4, px: 2 }}>
        <Container maxWidth="lg">
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StreakDisplay userId={userId} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    📈 Progresso Geral
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress?.xp_percentage ? progress.xp_percentage : 0}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    {progress?.current_xp || 0} / {progress?.xp_for_next_level || 100} XP
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && <MissionsBoard userId={userId} />}

          {activeTab === 2 && <GoalsManager userId={userId} />}

          {activeTab === 3 && <StreakDisplay userId={userId} />}

          {activeTab === 4 && <AreaScoringChart userId={userId} />}
        </Container>
      </Box>

      {/* Footer */}
      <Paper sx={{ mt: 'auto', p: 2, borderRadius: 0, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          🎮 Solo Leveling - Transforme sua vida em uma aventura épica
        </Typography>
        <Typography variant="caption">
          Nível: {progress?.level || 1} | Rank: {progress?.rank || 'Iniciante'} | 
          Seguidores: {progress?.total_followers || 0}
        </Typography>
      </Paper>
    </Box>
  );
}
