import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Stack, TextField } from '@mui/material';
import AuthContext from '../context/AuthContext';
import Header from '../components/Header';
import './SettingsPage.css';

function SettingsPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box className="settings-page">
      <Header userName={user?.name} />

      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper className="settings-box" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            ⚙️ Configurações
          </Typography>

          <Box className="settings-section" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              👤 Perfil
            </Typography>
            <Stack spacing={2}>
              <Box className="setting-item">
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Nome
                </Typography>
                <Typography variant="body1">{user?.name}</Typography>
              </Box>
              <Box className="setting-item">
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Email
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
              <Box className="setting-item">
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  ID
                </Typography>
                <Typography variant="body1">{user?.id}</Typography>
              </Box>
            </Stack>
          </Box>

          <Box className="settings-section" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🔐 Segurança
            </Typography>
            <Box className="setting-item">
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Senha
              </Typography>
              <Button variant="outlined" className="btn-secondary">
                Alterar Senha
              </Button>
            </Box>
          </Box>

          <Box className="settings-section danger" sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ⚠️ Perigo
            </Typography>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleLogout}
              className="btn-danger"
              fullWidth
            >
              Sair
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SettingsPage;

