import React, { useState, useContext } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Typography,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
} from '@mui/material';
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
    <Box className="login-page" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Card className="login-container" sx={{ boxShadow: 3 }}>
          <CardContent>
            <Box className="login-box" sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" className="logo" sx={{ mb: 1 }}>
                🎮 SoloLeveling
              </Typography>
              <Typography variant="body1" className="subtitle" sx={{ mb: 3, color: 'text.secondary' }}>
                Transforme sua vida em um RPG
              </Typography>

              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                centered
                sx={{ mb: 3 }}
              >
                <Tab label="Login" value="login" />
                <Tab label="Registrar" value="register" />
              </Tabs>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Stack spacing={2} component="form" onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
                {activeTab === 'login' ? (
                  <>
                    <TextField
                      type="email"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      fullWidth
                      required
                      variant="outlined"
                    />
                    <TextField
                      type="password"
                      placeholder="Senha"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      fullWidth
                      required
                      variant="outlined"
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                      {loading ? <CircularProgress size={24} /> : 'Entrar'}
                    </Button>
                  </>
                ) : (
                  <>
                    <TextField
                      type="text"
                      placeholder="Nome"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      fullWidth
                      required
                      variant="outlined"
                    />
                    <TextField
                      type="email"
                      placeholder="Email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      fullWidth
                      required
                      variant="outlined"
                    />
                    <TextField
                      type="password"
                      placeholder="Senha"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      fullWidth
                      required
                      variant="outlined"
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                      {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;



