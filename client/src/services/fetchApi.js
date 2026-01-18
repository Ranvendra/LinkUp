export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7777';

/**
 * Example of how to make requests using the native fetch API with cookies.
 * The key is `credentials: 'include'` which ensures cookies are sent and received.
 */
export const fetchAuth = {
    // Login equivalent using Fetch
    login: async (email, password) => {
        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // IMPORTANT: This allows receiving the HttpOnly cookie
            });

            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Fetch Login Error:", err);
            throw err;
        }
    },

    // Get Profile using the established cookie
    getProfile: async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/profile/view`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // IMPORTANT: Sends the 'LinkupToken' cookie with the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error("Fetch Profile Error:", err);
            throw err;
        }
    },

    // Logout
    logout: async () => {
        try {
            await fetch(`${BACKEND_URL}/logout`, {
                method: 'POST',
                credentials: 'include', // Necessary to tell server to clear the specific cookie from this origin
            });
        } catch (err) {
            console.error("Fetch Logout Error:", err);
        }
    }
};
