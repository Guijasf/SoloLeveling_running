import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Stack, CircularProgress, Chip } from '@mui/material';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import './HistoryPage.css';

function HistoryPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, week, month

  useEffect(() => {
    loadHistoryData();
  }, [filter]);

  const loadHistoryData = async () => {
    try {
      const response = await api.get(`/history/${user?.id}?period=${filter}`);
      setHistoryData(response.data.history || []);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getEventIcon = (eventType) => {
    const icons = {
      'level_up': '⬆️',
      'rank_up': '🏆',
      'achievement': '🎖️',
      'mission_completed': '✅',
      'streak_milestone': '🔥',
      'xp_earned': '⭐',
      'goal_completed': '🎯'
    };
    return icons[eventType] || '📌';
  };

  const getEventColor = (eventType) => {
    const colors = {
      'level_up': '#667eea',
      'rank_up': '#ffd700',
      'achievement': '#f093fb',
      'mission_completed': '#56ab2f',
      'streak_milestone': '#ff6b6b',
      'xp_earned': '#4ecdc4',
      'goal_completed': '#764ba2'
    };
    return colors[eventType] || '#a8b2d1';
  };

  if (loading) {
    return (
      <Box className="loading-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando histórico...</Typography>
      </Box>
    );
  }

  return (
    <Box className="history-page">
      <Header userName={user?.name} onSettingsClick={() => navigate('/settings')} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box className="history-header" sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            📜 Histórico de Eventos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Acompanhe sua jornada e evolução
          </Typography>

          <Stack direction="row" spacing={2} className="filter-buttons">
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'week' ? 'contained' : 'outlined'}
              onClick={() => setFilter('week')}
            >
              Última Semana
            </Button>
            <Button
              variant={filter === 'month' ? 'contained' : 'outlined'}
              onClick={() => setFilter('month')}
            >
              Último Mês
            </Button>
          </Stack>
        </Box>

        {historyData.length === 0 ? (
          <Paper className="empty-state" sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h2" sx={{ mb: 2 }}>📭</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Nenhum evento ainda
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete missões, ganhe XP e desbloqueie conquistas para ver seu histórico!
            </Typography>
          </Paper>
        ) : (
          <Box className="timeline">
            {historyData.map((event, index) => (
              <Paper
                key={index}
                className="timeline-item"
                sx={{
                  p: 3,
                  mb: 2,
                  borderLeft: `4px solid ${getEventColor(event.event_type)}`,
                  display: 'flex',
                  gap: 2
                }}
              >
                <Box
                  className="timeline-icon"
                  sx={{
                    background: getEventColor(event.event_type),
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}
                >
                  {getEventIcon(event.event_type)}
                </Box>

                <Box className="timeline-content" sx={{ flex: 1 }}>
                  <Box className="timeline-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="caption" className="timeline-date">
                      {formatDate(event.created_at)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" className="timeline-description" sx={{ mb: 2, color: 'text.secondary' }}>
                    {event.description}
                  </Typography>

                  {event.metadata && (
                    <Stack direction="row" spacing={1} className="timeline-metadata">
                      {event.metadata.xp_earned && (
                        <Chip
                          label={`+${event.metadata.xp_earned} XP`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {event.metadata.new_level && (
                        <Chip
                          label={`Level ${event.metadata.new_level}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                      {event.metadata.new_rank && (
                        <Chip
                          label={`Rank ${event.metadata.new_rank}`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default HistoryPage;

