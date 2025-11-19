import { jwtDecode } from 'jwt-decode';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const originalRequest = async (url, config) => {
    const response = await fetch(url, config);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.detail || error.message || 'Something went wrong');
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

const refreshToken = async (refresh) => {
    const response = await fetch(`${baseURL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });
    if (!response.ok) {
        throw new Error('Token refresh failed');
    }
    const data = await response.json();
    localStorage.setItem('authTokens', JSON.stringify(data));
    return data;
};

const customFetcher = async (url, config = {}) => {
    let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (authTokens) {
        const user = jwtDecode(authTokens.access);
        const isExpired = Date.now() >= user.exp * 1000;

        if (isExpired) {
            try {
                authTokens = await refreshToken(authTokens.refresh);
            } catch (error) {
                localStorage.removeItem('authTokens');
                window.location.href = '/login'; // Force logout
                return Promise.reject(error);
            }
        }

        config.headers = { ...config.headers, 'Authorization': `Bearer ${authTokens.access}` };
    }

    return originalRequest(url, config);
};

export default customFetcher;