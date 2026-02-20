import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="settings-page">
      <Header userName={user?.name} />

      <div className="settings-container">
        <div className="settings-box">
          <h2>⚙️ Configurações</h2>

          <div className="settings-section">
            <h3>👤 Perfil</h3>
            <div className="setting-item">
              <label>Nome</label>
              <p>{user?.name}</p>
            </div>
            <div className="setting-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="setting-item">
              <label>ID</label>
              <p>{user?.id}</p>
            </div>
          </div>

          <div className="settings-section">
            <h3>🔐 Segurança</h3>
            <div className="setting-item">
              <label>Senha</label>
              <button className="btn-secondary">Alterar Senha</button>
            </div>
          </div>

          <div className="settings-section danger">
            <h3>⚠️ Perigo</h3>
            <button onClick={handleLogout} className="btn-danger">
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

