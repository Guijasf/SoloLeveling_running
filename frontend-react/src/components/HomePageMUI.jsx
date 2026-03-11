import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  TextField,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  LocalFireDepartment,
  Favorite,
  CheckCircle,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import Layout from './Layout';

// ====== COMPONENTS ======
const StatCard = ({ icon: Icon, label, value, color, suffix = '' }) => {
  const muiTheme = useMuiTheme();
  return (
    <Card
      sx={{
        background: muiTheme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
        border: `1px solid ${muiTheme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${muiTheme.palette.primary.main}20`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Icon sx={{ fontSize: 32, color }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
          {value}{suffix}
        </Typography>
      </CardContent>
    </Card>
  );
};

const XPProgressCard = ({ currentXP, maxXP, level, nextLevel }) => {
  const muiTheme = useMuiTheme();
  const progress = (currentXP / maxXP) * 100;

  return (
    <Card
      sx={{
        background: muiTheme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(34, 255, 136, 0.05))'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(34, 255, 136, 0.03))',
        border: `2px solid ${muiTheme.palette.primary.main}40`,
        py: 3,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Nível {level}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Próximo: Nível {nextLevel}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {currentXP} / {maxXP} XP
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            background: muiTheme.palette.action.disabled,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.success.main})`,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

const StreakCard = ({ streak, bestStreak }) => {
  const muiTheme = useMuiTheme();
  return (
    <Card
      sx={{
        background: muiTheme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 107, 53, 0.05))'
          : 'linear-gradient(135deg, rgba(255, 107, 53, 0.08), rgba(255, 107, 53, 0.02))',
        border: `2px solid ${muiTheme.palette.warning.main}40`,
        textAlign: 'center',
      }}
    >
      <CardContent>
        <LocalFireDepartment sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
          {streak}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
          Dias consecutivos
        </Typography>
        <Chip
          label={`Melhor: ${bestStreak} dias`}
          size="small"
          variant="outlined"
          sx={{ borderColor: 'warning.main', color: 'warning.main' }}
        />
      </CardContent>
    </Card>
  );
};

const TaskItem = ({ emoji, title, completed, priority }) => {
  const muiTheme = useMuiTheme();
  const priorityColor = {
    high: 'error',
    medium: 'warning',
    low: 'success',
  };

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: `1px solid ${muiTheme.palette.divider}`,
        background: completed
          ? muiTheme.palette.mode === 'dark'
            ? 'rgba(34, 255, 136, 0.08)'
            : 'rgba(34, 255, 136, 0.03)'
          : 'transparent',
        opacity: completed ? 0.7 : 1,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 16px ${muiTheme.palette.primary.main}15`,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, py: 1.5 }}>
        <Box
          sx={{
            fontSize: 24,
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {emoji}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: '500',
              textDecoration: completed ? 'line-through' : 'none',
            }}
          >
            {title}
          </Typography>
        </Box>
        {completed && (
          <CheckCircle sx={{ color: 'success.main', fontSize: 24 }} />
        )}
        {!completed && (
          <Chip
            label={priority}
            size="small"
            color={priorityColor[priority]}
            variant="outlined"
          />
        )}
      </CardContent>
    </Card>
  );
};

// ====== MAIN COMPONENT ======
export default function HomePageMUI() {
  const muiTheme = useMuiTheme();
  const [loading] = useState(false);
  const [userData] = useState({
    username: 'Guilherme',
    level: 10,
    currentXP: 1415,
    maxXP: 2700,
    nextLevel: 11,
    streak: 15,
    bestStreak: 23,
    health: 95,
    completed: 8,
  });

  const [tasks] = useState([
    { id: 1, emoji: '🏃', title: 'Correr 5km', completed: true, priority: 'high' },
    { id: 2, emoji: '💻', title: 'Estudar React', completed: false, priority: 'high' },
    { id: 3, emoji: '📚', title: 'Ler 30 páginas', completed: false, priority: 'medium' },
    { id: 4, emoji: '💪', title: 'Treinar musculação', completed: true, priority: 'high' },
    { id: 5, emoji: '🥗', title: 'Comer saudável', completed: false, priority: 'low' },
  ]);

  const [achievements] = useState([
    { emoji: '🔥', label: 'Ativo', value: 15 },
    { emoji: '⭐', label: 'Completo', value: '85%' },
    { emoji: '💪', label: 'Força', value: 'A' },
  ]);

  return (
    <Layout userName={userData.username} userLevel={userData.level}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        {loading && (
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={200} />
          </Box>
        )}

        {/* XP Progress */}
        <Box sx={{ mb: 4 }}>
          <XPProgressCard
            currentXP={userData.currentXP}
            maxXP={userData.maxXP}
            level={userData.level}
            nextLevel={userData.nextLevel}
          />
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={EmojiEvents}
              label="Metas Completas"
              value={userData.completed}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={TrendingUp}
              label="Pontos de Vida"
              value={userData.health}
              color="error.main"
              suffix="%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StreakCard streak={userData.streak} bestStreak={userData.bestStreak} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: muiTheme.palette.mode === 'dark'
                  ? 'rgba(139, 92, 246, 0.1)'
                  : 'rgba(139, 92, 246, 0.05)',
                border: `1px solid ${muiTheme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3,
                textAlign: 'center',
              }}
            >
              <CardContent>
                <EmojiEvents sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  12
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Achievements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Achievements & Tasks */}
        <Grid container spacing={3}>
          {/* Left: Achievements */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  📊 Conquistas Hoje
                </Typography>
                <Grid container spacing={2}>
                  {achievements.map((ach, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                          background: muiTheme.palette.action.hover,
                          borderRadius: 1,
                          border: `1px solid ${muiTheme.palette.divider}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ fontSize: 28 }}>{ach.emoji}</Box>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {ach.label}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {ach.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Tasks */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                background: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    📋 Tarefas de Hoje
                  </Typography>
                  <Button startIcon={<Add />} variant="contained" size="small">
                    Nova
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      emoji={task.emoji}
                      title={task.title}
                      completed={task.completed}
                      priority={task.priority}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
