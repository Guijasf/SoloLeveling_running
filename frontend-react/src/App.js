import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/designSystem.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import PlaceholderPage from './pages/PlaceholderPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import GameDashboard from './pages/GameDashboard';
import AuthContext from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sessão do localStorage
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/game" />} />
          <Route path="/game" element={<PrivateRoute><GameDashboard /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/dashboard/classic" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/ranking" element={<PrivateRoute><PlaceholderPage title="Ranking" /></PrivateRoute>} />
          <Route path="/body" element={<PrivateRoute><PlaceholderPage title="Corpo" /></PrivateRoute>} />
          <Route path="/finance" element={<PrivateRoute><PlaceholderPage title="Financeiro" /></PrivateRoute>} />
          <Route path="/habits" element={<PrivateRoute><PlaceholderPage title="Hábitos" /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><PlaceholderPage title="Metas" /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/" element={token ? <Navigate to="/game" /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
