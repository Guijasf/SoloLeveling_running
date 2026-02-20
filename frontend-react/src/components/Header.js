import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <header className="header">
      <div className="header-left">
        <h1 className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          🎮 SoloLeveling
        </h1>
      </div>
      <nav className="header-nav">
        <button className="nav-link" onClick={() => navigate('/dashboard')}>
          📊 Dashboard
        </button>
        <button className="nav-link" onClick={() => navigate('/profile')}>
          👤 Perfil
        </button>
        <button className="nav-link" onClick={() => navigate('/history')}>
          📜 Histórico
        </button>
      </nav>
      <div className="header-right">
        <span className="user-name">{userName}</span>
        <NotificationBell />
        <button
          className="btn-icon"
          onClick={() => navigate('/settings')}
          title="Configurações"
        >
          ⚙️
        </button>
        <button
          className="btn-icon"
          onClick={handleLogout}
          title="Sair"
        >
          🚪
        </button>
      </div>
    </header>
  );
}

export default Header;

