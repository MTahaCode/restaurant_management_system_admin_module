import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  const message = error.response?.data?.message || 'An error occurred';
  console.error('API Error:', message);
  throw new Error(message);
};

export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
};

export const users = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/user/users', { params: filters });
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  create: async (userData) => {
    try {
      const response = await api.post('/user', userData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  update: async (id, userData) => {
    try {
      const response = await api.put(`/user/${id}`, userData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/user/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const orders = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/order', { params: filters });
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/order/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  update: async (id, orderData) => {
    try {
      const response = await api.put(`/order/${id}`, orderData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/order/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const notifications = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/notifications/notifications', { params: filters });
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  create: async (notificationData) => {
    try {
      const response = await api.post('/notifications/notifications', notificationData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  update: async (id, notificationData) => {
    try {
      const response = await api.put(`/notifications/notifications/${id}`, notificationData);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/notifications/notifications/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default api;