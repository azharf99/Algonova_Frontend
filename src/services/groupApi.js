import api from './api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const groupApi = {
  getAll: (url) => api(url),

  // Fetch all groups without pagination for selection lists
  getAllSimple: async () => {
    let groups = [];
    let url = `${API_BASE_URL}/groups/`;
    while (url) {
      const response = await api(url);
      groups = groups.concat(response.results);
      url = response.next;
    }
    return groups;
  },

  getById: (id) => api(`${API_BASE_URL}/groups/${id}/`),

  create: (group) => api(`${API_BASE_URL}/groups/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  }),

  update: (id, group) => api(`${API_BASE_URL}/groups/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group),
  }),

  delete: (id) => api(`${API_BASE_URL}/groups/${id}/`, {
    method: 'DELETE',
  }),

  // NOTE: Your backend has this at `.../import` but it expects multipart/form-data
  // For consistency with the student import, we'll assume a JSON endpoint.
  // If you need multipart, this would require a different setup.
  importCSV: (groups) => api(`${API_BASE_URL}/groups/import_json/`, { // Assuming a new endpoint `import_json`
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groups),
  }),
};