import api from './api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const lessonApi = {
  getAll: (url) => api(url),

  getById: (id) => api(`${API_BASE_URL}/lessons/${id}/`),

  create: (lesson) => api(`${API_BASE_URL}/lessons/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lesson),
  }),

  update: (id, lesson) => api(`${API_BASE_URL}/lessons/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lesson),
  }),

  delete: (id) => api(`${API_BASE_URL}/lessons/${id}/`, {
    method: 'DELETE',
  }),

  // Assuming a JSON import endpoint for consistency
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', JSON.stringify(file));
    return api(`${API_BASE_URL}/lessons/import/`, {
      method: 'POST',
      body: formData,
    });
  },
};