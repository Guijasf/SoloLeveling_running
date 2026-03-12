import React, { useContext } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';
import PremiumHeader from '../components/premium/PremiumHeader';
import '../styles/designSystem.css';
import './PlaceholderPage.css';

function PlaceholderPage({ title }) {
  const { user } = useContext(AuthContext);

  return (
    <Box className="placeholder-page">
      <PremiumHeader
        userName={user?.name || 'Usuário'}
        level={1}
        rank="E"
        xp={0}
        nextLevelXp={100}
        xpPercentage={0}
      />
      <Box className="placeholder-content" sx={{ p: 2 }}>
        <Card className="placeholder-card" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" className="placeholder-title" sx={{ mb: 2 }}>
              {title}
            </Typography>
            <Typography variant="body1" className="placeholder-text" color="text.secondary">
              Em breve vamos evoluir esta área.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PlaceholderPage;

