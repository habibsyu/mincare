import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Assessment API
export const assessmentAPI = {
  getQuestions: (type) => api.get(`/assessments/questions?type=${type}`),
  submit: (data) => api.post('/assessments', data),
  getResult: (id) => api.get(`/assessments/${id}`),
  getHistory: () => api.get('/assessments/history'),
};

// Content API
export const contentAPI = {
  getAll: (params) => api.get('/contents', { params }),
  getById: (id) => api.get(`/contents/${id}`),
  create: (data) => api.post('/contents', data),
  update: (id, data) => api.put(`/contents/${id}`, data),
  delete: (id) => api.delete(`/contents/${id}`),
};

// Blog API
export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// Community API
export const communityAPI = {
  getLinks: () => api.get('/community/links'),
  createLink: (data) => api.post('/community/links', data),
  updateLink: (id, data) => api.put(`/community/links/${id}`, data),
  deleteLink: (id) => api.delete(`/community/links/${id}`),
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  ban: (id) => api.post(`/users/${id}/ban`),
  unban: (id) => api.post(`/users/${id}/unban`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getAssessments: (params) => api.get('/admin/assessments', { params }),
  getSessions: (params) => api.get('/admin/sessions', { params }),
};

// Counseling API
export const counselingAPI = {
  getSessions: (params) => api.get('/counseling/sessions', { params }),
  getSession: (id) => api.get(`/counseling/sessions/${id}`),
  claimSession: (id) => api.post(`/counseling/sessions/${id}/claim`),
  closeSession: (id) => api.post(`/counseling/sessions/${id}/close`),
};

export default api;