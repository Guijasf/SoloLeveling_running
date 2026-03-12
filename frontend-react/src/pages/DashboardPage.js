import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import RadarChart from '../components/RadarChart';
import AchievementsCard from '../components/AchievementsCard';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setError('');
      const response = await api.get(`/dashboard/${user?.id}`);
      console.log('Dados do dashboard recebidos:', response.data);

      // Validar e limpar dados
      const cleanData = cleanDashboardData(response.data);
      setDashboardData(cleanData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard: ' + (err.message || ''));
      console.error('Erro completo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar e validar dados
  const cleanDashboardData = (data) => {
    if (!data) return {};

    return {
      level: data.level || 1,
      rank: typeof data.rank === 'string' ? data.rank : 'E',
      xp: typeof data.xp === 'number' ? data.xp : 0,
      next_level_xp: typeof data.next_level_xp === 'number' ? data.next_level_xp : 100,
      streak: typeof data.streak === 'number' ? data.streak : 0,
      achievements_count: typeof data.achievements_count === 'number' ? data.achievements_count : 0,
      life_score: typeof data.life_score === 'number' ? data.life_score : 0,
      focus_area: typeof data.focus_area === 'string' ? data.focus_area : null,
      profile_name: typeof data.profile_name === 'string' ? data.profile_name : (typeof data.name === 'string' ? data.name : 'Usuário'),
      area_scores: Array.isArray(data.area_scores) ? data.area_scores.filter(a => a && typeof a === 'object') : [],
      today_missions: Array.isArray(data.today_missions) ? data.today_missions.filter(m => m && typeof m === 'object') : [],
      achievements: Array.isArray(data.achievements) ? data.achievements.filter(a => a && typeof a === 'object') : []
    };
  };

  if (loading) {
    return (
      <Box className="loading-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box className="dashboard-page">
      <Header userName={user?.name} onSettingsClick={() => navigate('/settings')} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3} className="main-grid">
          <Grid item xs={12} md={6} className="left-column">
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <ProfileCard data={dashboardData} />
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 2, mt: 3 }}>
              <RadarChart data={dashboardData} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} className="right-column">
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <AchievementsCard data={dashboardData} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;


