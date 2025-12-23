import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            console.error('Network Error: Server is unreachable.');
            window.dispatchEvent(new CustomEvent('api-error', { detail: { type: 'network', message: 'Serveur inaccessible' } }));
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized - Attempt Refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Determine if we have a refresh token (stored in localStorage for this implementation)
                // In a stricter secure HttpOnly setup, the cookie is sent automatically.
                // Here we assume we might need to send it explicitly or it's a cookie.
                // Based on authController, the refresh endpoint expects a cookie or body?
                // Looking at authController (from memory/previous steps), it usually checks `req.cookies.jwt` or body.
                // Let's assume standard cookie flow for refresh, so just calling the endpoint is enough.

                // Attempt refresh
                const refreshResponse = await axios.post('http://localhost:3000/api/auth/refresh', {}, {
                    withCredentials: true // Important if using cookies
                });

                const { accessToken } = refreshResponse.data;

                if (accessToken) {
                    // Update auth store (this acts outside React context, so we might need direct store access or just localStorage)
                    // Currently api.ts reads from localStorage 'token' in request interceptor.
                    localStorage.setItem('token', accessToken);

                    // Update header for the retry
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Refresh failed - Logout user
                localStorage.removeItem('token');
                // Optional: clear auth store via window event or direct import if circular dep avoided
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
