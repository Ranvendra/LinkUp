import { post, get } from '../utils/request';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:7777' : '');

/**
 * Auth API services using the modular fetch utility.
 * This is now much cleaner and reuses the core request logic.
 */
export const fetchAuth = {
    // Login
    login: async (email, password) => {
        return await post('/login', { email, password });
    },

    // Get Profile
    getProfile: async () => {
        return await get('/profile/view');
    },

    // Logout
    logout: async () => {
        return await post('/logout');
    },
};
