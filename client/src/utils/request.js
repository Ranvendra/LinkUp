const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:7777' : '');

/**
 * Modular request utility for performing fetch operations.
 * Automatically handles credentials and JSON headers.
 * 
 * @param {string} url - The endpoint URL (relative to BACKEND_URL).
 * @param {string} method - The HTTP method (GET, POST, etc.).
 * @param {object|null} body - The request body.
 * @param {object} customHeaders - Additional headers.
 * @returns {Promise<any>} - The response data.
 */
const request = async (url, method = 'GET', body = null, customHeaders = {}) => {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...customHeaders,
            },
            credentials: 'include', // Important for sending/receiving cookies
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${BACKEND_URL}${url}`, config);

        if (!response.ok) {
            // Try to parse error message from server
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        // Return null if response status is 204 No Content, otherwise parse JSON
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Request Error [${method} ${url}]:`, error);
        throw error;
    }
};

export const get = (url, headers) => request(url, 'GET', null, headers);
export const post = (url, body, headers) => request(url, 'POST', body, headers);
export const put = (url, body, headers) => request(url, 'PUT', body, headers);
export const del = (url, headers) => request(url, 'DELETE', null, headers);

export default request;
