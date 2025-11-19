const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  },

  refresh: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    return response.json();
  }
};