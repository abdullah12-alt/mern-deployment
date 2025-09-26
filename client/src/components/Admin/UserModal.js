// client/src/components/Admin/UserModal.js
import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import axios from '../../axios';
import React from 'react';

function UserModal({ open, onClose, user, mode, onSave }) {
  const [formData, setFormData] = useState(
    user || { name: '', email: '', password: '', role: 'user', isActive: true }
  );
  const [error, setError] = useState('');

  // Reset form when opening in add mode
  React.useEffect(() => {
    if (open && mode === 'add') {
      setFormData({ name: '', email: '', password: '', role: 'user', isActive: true });
      setError('');
    } else if (open && user) {
      setFormData(user);
      setError('');
    }
  }, [open, mode, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      if (mode === 'add') {
        await axios.post('/api/users', formData);
      } else {
        await axios.put(`/api/users/${user._id}`, formData);
      }
      onSave();
      onClose();
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to save user');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {mode === 'add' ? 'Add User' : mode === 'edit' ? 'Edit User' : 'View User'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={mode === 'view'}
          variant="outlined"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={mode === 'view'}
          variant="outlined"
        />
        {mode === 'add' && (
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
        )}
        <FormControl fullWidth margin="normal" disabled={mode === 'view'}>
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={mode === 'view'}>
          <InputLabel>Status</InputLabel>
          <Select
            name="isActive"
            value={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </Select>
        </FormControl>
        {(mode === 'edit' || mode === 'add') && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Save
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={onClose}
          fullWidth
          sx={{ mt: 1 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}

export default UserModal;