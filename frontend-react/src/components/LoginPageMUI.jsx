import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Login Page - Versão MUI Profissional
 */
function LoginPageMUI() {
  const muiTheme = useMuiTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null); // Limpar erro ao digitar
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);

      if (response.data.token) {
        // Salvar token e usuário
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        localStorage.setItem('userId', response.data.user.id);

        setSuccess('Login realizado com sucesso! Redirecionando...');

        // Redirecionar para dashboard após 1.5s
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Erro ao fazer login. Verifique suas credenciais.'
      );
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: muiTheme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${muiTheme.palette.primary.main}20, transparent)`,
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${muiTheme.palette.secondary.main}20, transparent)`,
          filter: 'blur(40px)',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {/* Left Side - Info (Desktop Only) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ⚔️
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Solo Leveling
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                Transforme sua vida em um RPG. Complete metas, ganhe XP, suba de nível e desbloqueie conquistas reais.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ✨ Gamificação de Vida Real
              </Typography>
              <Typography variant="body2" color="textSecondary">
                🎮 Sistema de Progressão
              </Typography>
              <Typography variant="body2" color="textSecondary">
                🏆 Conquistas e Recompensas
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                background: muiTheme.palette.background.paper,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    Bem-vindo
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Faça login para continuar sua jornada
                  </Typography>
                </Box>

                {/* Messages */}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  {/* Email Input */}
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ mr: 1, color: muiTheme.palette.action.active }} />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="seu@email.com"
                  />

                  {/* Password Input */}
                  <TextField
                    fullWidth
                    label="Senha"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    required
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ mr: 1, color: muiTheme.palette.action.active }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    placeholder="••••••••"
                  />

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>

                  {/* Demo Credentials */}
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: muiTheme.palette.action.hover,
                      borderRadius: 1,
                      mb: 2,
                      border: `1px dashed ${muiTheme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" display="block" sx={{ fontWeight: 600, mb: 1 }}>
                      📌 Demo (Teste)
                    </Typography>
                    <Typography variant="caption" display="block">
                      Email: <strong>user@example.com</strong>
                    </Typography>
                    <Typography variant="caption" display="block">
                      Senha: <strong>password123</strong>
                    </Typography>
                  </Paper>

                  {/* Footer */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      Não tem uma conta?{' '}
                      <MuiLink
                        href="#"
                        sx={{
                          fontWeight: 600,
                          color: muiTheme.palette.primary.main,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Registre-se
                      </MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Bottom Text */}
            <Typography
              variant="caption"
              sx={{
                textAlign: 'center',
                display: 'block',
                mt: 2,
                color: muiTheme.palette.text.secondary,
              }}
            >
              Solo Leveling © 2024 | Sistema Gamificado de Vida
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LoginPageMUI;
