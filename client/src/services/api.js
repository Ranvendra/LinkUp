import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:7777' : '');

if (!import.meta.env.VITE_BACKEND_URL && window.location.hostname !== 'localhost') {
  console.error("VITE_BACKEND_URL is not set in production. Requests will likely fail. Please set it in your hosting platform environment variables.");
}

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This allows cookies to be sent with requests and is the Axios equivalent of credentials: 'include'
});

// Add a request interceptor to include the token in headers
// This is critical for production where strict browser privacy settings might block 3rd-party cookies
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
