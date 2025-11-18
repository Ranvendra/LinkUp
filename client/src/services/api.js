import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7777';

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This allows cookies to be sent with requests
});

// Auth API calls
export const authAPI = {
  signup: (userData) => {
    return api.post('/signup', userData);
  },

  login: (credentials) => {
    return api.post('/login', credentials);
  },

  logout: () => {
    return api.post('/logout');
  },
};

export default api;
