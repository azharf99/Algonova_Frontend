import api from './api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const studentApi = {
  getAll: (url) => api(url),

  // Fetch all students without pagination for selection lists
  getAllSimple: async () => {
    let students = [];
    let url = `${API_BASE_URL}/students/`;
    while (url) {
      const response = await api(url);
      students = students.concat(response.results);
      url = response.next;
    }
    return students;
  },

  getById: (id) => api(`${API_BASE_URL}/students/${id}/`),

  create: (student) => api(`${API_BASE_URL}/students/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  }),

  update: (id, student) => api(`${API_BASE_URL}/students/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  }),

  delete: (id) => api(`${API_BASE_URL}/students/${id}/`, {
    method: 'DELETE',
  }),

  // This endpoint expects multipart/form-data with a 'file' field.
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', JSON.stringify(file));
    return api(`${API_BASE_URL}/students/import/`, {
      method: 'POST',
      body: formData,
    });
  },
};