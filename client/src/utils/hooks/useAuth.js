import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement token verification
      setLoading(false);
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/admin/users');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return { user, loading, login, logout };
};