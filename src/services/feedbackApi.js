import api from './api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// The base URL for non-api endpoints might be different.
// We'll construct it from the main URL.
const getBaseUrl = () => {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
}

const downloadFile = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Download failed');
    }
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'feedbacks.pdf';
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length > 1) {
            filename = filenameMatch[1];
        }
    }
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
};

export const feedbackApi = {
  getAll: (url) => api(url),
  getById: (id) => api(`${API_BASE_URL}/feedbacks/${id}/`),
  create: (feedback) => api(`${API_BASE_URL}/feedbacks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  }),
  update: (id, feedback) => api(`${API_BASE_URL}/feedbacks/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  }),
  delete: (id) => api(`${API_BASE_URL}/feedbacks/${id}/`, { method: 'DELETE' }),
  importCSV: (feedbacks) => api(`${API_BASE_URL}/feedbacks/import_json/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedbacks),
  }),
  downloadAll: () => downloadFile(`${getBaseUrl()}/feedback/download-all/`),
  downloadByGroup: (groupId) => downloadFile(`${getBaseUrl()}/feedback/download/${groupId}/`),
};