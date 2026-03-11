import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Select,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  VideogameAsset as GamesIcon,
  Done as ChecklistIcon,
  FavoriteBorder as HabitsIcon,
  EmojiEvents as AchievementsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  PersonOutline as ProfileIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../context/ThemeContext';

/**
 * Layout Profissional com Navbar + Sidebar
 * Componente reutilizável para todas as páginas
 */
function Layout({ children, userName = 'Jogador', userLevel = 10 }) {
  const muiTheme = useMuiTheme();
  const { themeName, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const navItems = [
    { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { label: 'Arena', icon: GamesIcon, path: '/game' },
    { label: 'Metas', icon: AchievementsIcon, path: '/goals' },
    { label: 'Hábitos', icon: HabitsIcon, path: '/habits' },
    { label: 'Tarefas', icon: ChecklistIcon, path: '/tasks' },
  ];

  const handleProfileMenuClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: muiTheme.palette.background.paper,
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Menu Icon para Mobile */}
          <IconButton
            color="primary"
            onClick={() => setSidebarOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.success.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ⚔️
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Solo Leveling
            </Typography>
          </Box>

          {/* Theme Selector */}
          <Select
            value={themeName}
            onChange={(e) => setTheme(e.target.value)}
            size="small"
            sx={{
              width: 140,
              color: muiTheme.palette.text.primary,
              backgroundColor: muiTheme.palette.action.hover,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: muiTheme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: muiTheme.palette.primary.main,
              },
              '& .MuiSvgIcon-root': {
                color: muiTheme.palette.text.primary,
              },
            }}
          >
            <MenuItem value="default">🔵 Default</MenuItem>
            <MenuItem value="arise">🟣 ARISE</MenuItem>
          </Select>

          {/* Profile Menu */}
          <Box>
            <IconButton
              onClick={handleProfileMenuClick}
              sx={{
                p: 0,
                ml: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem disabled sx={{ py: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {userName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Nível {userLevel}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleProfileMenuClose}>
                <ProfileIcon sx={{ mr: 1 }} fontSize="small" />
                Perfil
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <SettingsIcon sx={{ mr: 1 }} fontSize="small" />
                Configurações
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR - Desktop */}
      <Box
        sx={{
          width: 250,
          backgroundColor: muiTheme.palette.background.paper,
          borderRight: `1px solid ${muiTheme.palette.divider}`,
          pt: 9,
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <List sx={{ p: 2 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => (window.location.href = item.path)}
              sx={{
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: muiTheme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <item.icon color="primary" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* SIDEBAR - Mobile */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: muiTheme.palette.background.paper,
            width: 250,
            pt: 2,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ p: 2 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => {
                window.location.href = item.path;
                setSidebarOpen(false);
              }}
              sx={{
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: muiTheme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                <item.icon color="primary" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { xs: 0, md: '250px' },
          pt: 9,
          backgroundColor: muiTheme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
