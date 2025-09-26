// client/src/components/Auth/Login.js
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'white',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;