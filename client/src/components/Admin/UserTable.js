// client/src/components/Admin/UserTable.js
import { useState, useEffect, useContext } from 'react';
import axios from '../../axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Pagination,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Visibility, ToggleOn, ToggleOff } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import UserModal from './UserModal';

function UserTable() {
  const { logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [loading, setLoading] = useState(false);

  // Add handler for opening add user modal
  const handleAddUser = () => {
    setModalUser(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter || undefined,
        active: activeFilter || undefined,
        sort,
      };
      const res = await axios.get('/api/users', { params });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // logout();
      }
      console.error('Fetch users error:', error.response?.data?.msg || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, activeFilter, sort]);

  const handlePageChange = (event, value) => {
    fetchUsers(value);
  };

  const handleSort = (field) => {
    const [currentField, direction] = sort.split(':');
    setSort(`${field}:${currentField === field && direction === 'asc' ? 'desc' : 'asc'}`);
  };

  const handleAction = (action, user) => {
    if (action === 'view' || action === 'edit') {
      setModalUser(user);
      setModalMode(action);
      setModalOpen(true);
    } else if (action === 'toggle') {
      setLoading(true);
      axios
        .put(`/api/users/${user._id}`, { isActive: !user.isActive })
        .then(() => fetchUsers(pagination.current))
        .catch((err) => console.error('Toggle error:', err.response?.data?.msg))
        .finally(() => setLoading(false));
    } else if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this user?')) {
        setLoading(true);
        axios
          .delete(`/api/users/${user._id}`)
          .then(() => fetchUsers(pagination.current))
          .catch((err) => console.error('Delete error:', err.response?.data?.msg))
          .finally(() => setLoading(false));
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUser}
        sx={{ mb: 3, mr: 2 }}
      >
        Add User
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={logout}
        sx={{ mb: 3 }}
      >
        Logout
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          label="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: '1 1 300px' }}
          variant="outlined"
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 120 }}
          variant="outlined"
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
        <Select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 120 }}
          variant="outlined"
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort('name')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Name {sort.startsWith('name') && (sort.includes('asc') ? '↑' : '↓')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleAction('view', user)} title="View">
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleAction('edit', user)} title="Edit">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleAction('toggle', user)} title={user.isActive ? 'Deactivate' : 'Activate'}>
                      {user.isActive ? <ToggleOff /> : <ToggleOn />}
                    </IconButton>
                    <IconButton onClick={() => handleAction('delete', user)} title="Delete">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={pagination.pages}
        page={pagination.current}
        onChange={handlePageChange}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        color="primary"
      />
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={modalUser}
        mode={modalMode}
        onSave={() => fetchUsers(pagination.current)}
      />
    </Box>
  );
}

export default UserTable;