import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  Grid,
  Avatar,
  Chip,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import Header from '../components/Header';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    title: '',
    public_profile: true
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await api.get(`/profile/${user?.id}`);
      setProfileData(response.data);
      setFormData({
        bio: response.data.bio || '',
        title: response.data.title || '',
        public_profile: response.data.public_profile !== false
      });
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/profile/${user?.id}`, formData);
      setEditing(false);
      loadProfileData();
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar perfil');
    }
  };

  if (loading) {
    return (
      <Box className="loading-container" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando perfil...</Typography>
      </Box>
    );
  }

  return (
    <Box className="profile-page">
      <Header userName={user?.name} onSettingsClick={() => navigate('/settings')} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Profile Header Card */}
        <Card className="profile-container" sx={{ mb: 4 }}>
          <CardContent>
            <Box className="profile-header" sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 3, alignItems: 'start' }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Box className="profile-avatar" sx={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: '2rem',
                      backgroundColor: 'primary.main',
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Chip
                    label={`Lv ${profileData?.level || 1}`}
                    color="primary"
                    sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)' }}
                  />
                </Box>

                <Box className="profile-info">
                  <Typography variant="h4" sx={{ mb: 1 }}>{user?.name}</Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                    {profileData?.title || 'Novato'}
                  </Typography>
                  <Chip
                    label={`Rank ${profileData?.rank || 'E'}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box className="profile-actions">
                <Stack direction="column" spacing={1}>
                  {!editing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setEditing(true)}
                      startIcon={<EditIcon />}
                    >
                      Editar Perfil
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleSave}
                        startIcon={<SaveIcon />}
                        fullWidth
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setEditing(false)}
                        startIcon={<CancelIcon />}
                        fullWidth
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }} className="profile-stats">
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" className="stat-value">{profileData?.total_xp || 0}</Typography>
                <Typography variant="body2" color="textSecondary" className="stat-label">XP Total</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" className="stat-value">{profileData?.streak || 0}</Typography>
                <Typography variant="body2" color="textSecondary" className="stat-label">🔥 Sequência</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" className="stat-value">{profileData?.achievements_count || 0}</Typography>
                <Typography variant="body2" color="textSecondary" className="stat-label">🏆 Conquistas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" className="stat-value">{profileData?.days_active || 0}</Typography>
                <Typography variant="body2" color="textSecondary" className="stat-label">📅 Dias Ativos</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Profile Details */}
        <Stack spacing={3} className="profile-details">
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>📝 Biografia</Typography>
              {editing ? (
                <TextField
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Conte um pouco sobre você..."
                  fullWidth
                  variant="outlined"
                />
              ) : (
                <Typography>{profileData?.bio || 'Nenhuma biografia definida.'}</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>🎯 Título Atual</Typography>
              {editing ? (
                <TextField
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Estrategista, Guerreiro, Sábio..."
                  fullWidth
                  variant="outlined"
                />
              ) : (
                <Typography>{profileData?.title || 'Novato'}</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>🌐 Privacidade</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.public_profile}
                    onChange={(e) => setFormData({...formData, public_profile: e.target.checked})}
                    disabled={!editing}
                  />
                }
                label="Perfil público (outros usuários podem ver)"
              />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default ProfilePage;

