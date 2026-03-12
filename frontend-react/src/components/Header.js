import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Header.css';

function Header({ userName }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Box className="header-left" sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            className="logo"
            onClick={() => navigate('/dashboard')}
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            🎮 SoloLeveling
          </Typography>
        </Box>
        
        <Box className="header-nav" component="nav" sx={{ display: 'flex', gap: 2, flex: 1 }}>
          <Button
            className="nav-link"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            📊 Dashboard
          </Button>
          <Button
            className="nav-link"
            color="inherit"
            onClick={() => navigate('/profile')}
          >
            👤 Perfil
          </Button>
          <Button
            className="nav-link"
            color="inherit"
            onClick={() => navigate('/history')}
          >
            📜 Histórico
          </Button>
        </Box>

        <Box className="header-right" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" className="user-name">
            {userName}
          </Typography>
          <NotificationBell />
          <IconButton
            className="btn-icon"
            color="inherit"
            onClick={() => navigate('/settings')}
            title="Configurações"
            size="small"
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            className="btn-icon"
            color="inherit"
            onClick={handleLogout}
            title="Sair"
            size="small"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

