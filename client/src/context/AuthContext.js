// client/src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from '../axios'; // from src/context/AuthContext.js
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, role: decoded.role });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser({ id: res.data.user.id, role: res.data.user.role });
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};