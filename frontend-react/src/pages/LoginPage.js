import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import './LoginPage.css';

function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando login com:', loginData);
      const response = await api.post('/auth/login', loginData);
      console.log('Resposta do backend:', response.data);
      const { access_token, user } = response.data;
      if (!access_token || !user) {
        throw new Error('Resposta do servidor inválida');
      }
      login(user, access_token);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Erro ao fazer login';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando registrar com:', registerData);
      const response = await api.post('/auth/register', registerData);
      console.log('Resposta do backend (register):', response.data);
      const { access_token, user } = response.data;
      if (!access_token || !user) {
        throw new Error('Resposta do servidor inválida');
      }
      login(user, access_token);
    } catch (err) {
      console.error('Erro ao registrar:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Erro ao registrar';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>🎮 SoloLeveling</h1>
          <p className="subtitle">Transforme sua vida em um RPG</p>

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Registrar
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <input
                type="text"
                placeholder="Nome"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;



