import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { GoalsComponent, StreakComponent, MissionsComponent, StatisticsComponent } from '../components/GameComponents';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const GameDashboard = () => {
  const [userId, setUserId] = useState(1); // Default user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Get user from localStorage or use default
    const storedUser = localStorage.getItem('userId');
    if (storedUser) {
      setUserId(parseInt(storedUser));
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Box className="game-dashboard" sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0F1A 0%, #1a1f35 100%)',
      color: '#fff',
      paddingBottom: 5,
    }}>
      {/* Header */}
      <Box className="dashboard-header" sx={{
        background: 'linear-gradient(135deg, #1a1f35 0%, #2d3748 100%)',
        padding: '20px',
        borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Typography variant="h3" sx={{
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
        }}>
          ⚔️ SoloLeveling RPG
        </Typography>
        <Box className="header-info" sx={{ display: 'flex', gap: 2, fontSize: '14px', color: '#999' }}>
          <Typography variant="caption">User ID: {userId}</Typography>
        </Box>
      </Box>

      {/* Notification */}
      {notification && (
        <Alert
          severity={notification.type === 'success' ? 'success' : 'error'}
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {notification.message}
        </Alert>
      )}

      {/* Navigation Tabs */}
      <Paper sx={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 0, borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ '& .MuiTab-root': { color: '#fff' } }}
        >
          <Tab label="📊 Overview" value="overview" />
          <Tab label="🎯 Metas" value="goals" />
          <Tab label="🎮 Missões" value="missions" />
          <Tab label="🔥 Sequência" value="streak" />
        </Tabs>
      </Paper>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {activeTab === 'overview' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <StatisticsComponent userId={userId} />
            <Paper sx={{
              padding: '20px',
              background: '#0B0F1A',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
            }}>
              <Typography variant="h5" sx={{ marginBottom: 2, color: '#3B82F6' }}>
                📖 Como Jogar
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="⭐ Complete metas para ganhar XP" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🎮 Realize missões diárias para bônus" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🔥 Mantenha sua sequência ativa (multiplicador até 1.5x)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="🏆 Suba de nível e desbloqueie conquistas" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="💰 Ganhe XP em diferentes áreas de vida" />
                </ListItem>
              </List>
            </Paper>
          </Box>
        )}

        {activeTab === 'goals' && <GoalsComponent userId={userId} />}

        {activeTab === 'missions' && <MissionsComponent userId={userId} />}

        {activeTab === 'streak' && <StreakComponent userId={userId} />}
      </Container>

      {/* Footer */}
      <Box className="dashboard-footer" sx={{
        textAlign: 'center',
        padding: '20px',
        color: '#666',
        fontSize: '12px',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        marginTop: 5,
      }}>
        <Typography variant="caption">
          SoloLeveling RPG © 2024 | Gamificação de Vida
        </Typography>
      </Box>
    </Box>
  );
};

export default GameDashboard;
