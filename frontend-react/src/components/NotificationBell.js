import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Badge, Menu, MenuItem, Typography, Stack, Paper, Divider, Chip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import './NotificationBell.css';

function NotificationBell() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get(`/notifications/${user?.id}`);
      const notifs = response.data.notifications || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      loadNotifications();
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/${user?.id}/read-all`);
      loadNotifications();
    } catch (err) {
      console.error('Erro ao marcar todas:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'level_up': '⬆️',
      'rank_up': '🏆',
      'achievement': '🎖️',
      'streak_lost': '💔',
      'streak_milestone': '🔥',
      'new_mission': '📋',
      'goal_deadline': '⏰',
      'focus_reminder': '🎯'
    };
    return icons[type] || '🔔';
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="notification-bell">
      <Button
        className="bell-button"
        onClick={handleMenuOpen}
        sx={{ position: 'relative', minWidth: 'auto' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 350, maxHeight: 400, borderRadius: 2 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Notificações
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={markAllAsRead}
                sx={{ fontSize: '12px' }}
              >
                Marcar todas como lidas
              </Button>
            )}
          </Box>
          <Divider />
        </Box>

        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box className="empty-notifications" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                📭 Nenhuma notificação
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <Paper
                key={notif.id}
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => !notif.read && markAsRead(notif.id)}
                sx={{
                  m: 1,
                  p: 2,
                  borderLeft: `4px solid ${notif.read ? '#ccc' : '#667eea'}`,
                  bgcolor: notif.read ? '#f5f5f5' : 'primary.light',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 1
                  }
                }}
              >
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box className="notification-icon" sx={{ fontSize: '20px', flexShrink: 0 }}>
                    {getNotificationIcon(notif.type)}
                  </Box>
                  <Box className="notification-content" sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {notif.title}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5, color: 'text.secondary' }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" className="notification-time" sx={{ fontSize: '11px', color: 'text.disabled' }}>
                      {new Date(notif.created_at).toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  {!notif.read && (
                    <Box className="unread-dot" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', mt: 1, flexShrink: 0 }} />
                  )}
                </Box>
              </Paper>
            ))
          )}
        </Box>
      </Menu>
    </Box>
  );
}

export default NotificationBell;

