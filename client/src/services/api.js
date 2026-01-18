import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7777';

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This allows cookies to be sent with requests and is the Axios equivalent of credentials: 'include'
});

// Auth API calls
export const authAPI = {
  signup: (userData) => {
    return api.post('/signup', userData);
  },

  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    // Token is now handled automatically via HttpOnly Cookie set by the server
    return response;
  },

  logout: async () => {
    // Session is cleared by the server clearing the cookie
    return await api.post('/logout');
  },

  deleteProfile: async () => {
    return await api.delete('/profile/delete');
  },
};

export default api;
