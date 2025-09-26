import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
      }}
    >
      <Container maxWidth="sm" sx={{ bgcolor: 'white', p: 5, borderRadius: 3, boxShadow: 6, textAlign: 'center' }}>
        <PeopleAltIcon sx={{ fontSize: 64, color: '#2196f3', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom color="primary">
          Welcome to User Management Portal
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Effortlessly manage users, roles, and access with a beautiful, modern dashboard.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, fontSize: 18, borderRadius: 2, boxShadow: 2 }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}

export default LandingPage;
