import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import './NotificationBell.css';

function NotificationBell() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <div className="notification-bell">
      <button
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <p>📭 Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notification-time">
                      {new Date(notif.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  {!notif.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

