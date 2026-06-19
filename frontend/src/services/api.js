import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  getAll(params = {}) {
    return apiClient.get('/api/tasks', { params }).then((r) => r.data);
  },

  getById(id) {
    return apiClient.get(`/api/tasks/${id}`).then((r) => r.data);
  },

  create(data) {
    return apiClient.post('/api/tasks', data).then((r) => r.data);
  },

  update(id, data) {
    return apiClient.put(`/api/tasks/${id}`, data).then((r) => r.data);
  },

  remove(id) {
    return apiClient.delete(`/api/tasks/${id}`).then((r) => r.data);
  },

  getStats() {
    return apiClient.get('/api/tasks/stats').then((r) => r.data);
  },
};

export const healthApi = {
  check() {
    return apiClient.get('/health').then((r) => r.data);
  },
};
