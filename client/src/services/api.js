import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth endpoints
export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (userData) => api.post('/auth/register', userData);
export const getMeApi = () => api.get('/auth/me');
export const updateProfileApi = (profileData) => api.put('/auth/profile', profileData);
export const toggleBookmarkFormulaApi = (formulaId) => api.post('/auth/bookmark-formula', { formulaId });
export const toggleCompleteTopicApi = (topicSlug) => api.post('/auth/complete-topic', { topicSlug });

// Topics endpoints
export const getTopicsApi = (params) => api.get('/topics', { params });
export const getTopicBySlugApi = (slug) => api.get(`/topics/${slug}`);
export const submitTopicTestApi = (slug, testData) => api.post(`/topics/${slug}/submit-test`, testData);
export const createTopicApi = (topicData) => api.post('/topics', topicData);
export const updateTopicApi = (slug, topicData) => api.put(`/topics/${slug}`, topicData);

// Formulas endpoints
export const getFormulasApi = (params) => api.get('/formulas', { params });
export const getFormulaTopicsApi = () => api.get('/formulas/topics');
export const createFormulaApi = (data) => api.post('/formulas', data);
export const updateFormulaApi = (id, data) => api.put(`/formulas/${id}`, data);
export const deleteFormulaApi = (id) => api.delete(`/formulas/${id}`);

// Exams endpoints
export const getExamsApi = (params) => api.get('/exams', { params });
export const getExamBySlugApi = (slug) => api.get(`/exams/${slug}`);

// Companies endpoints
export const getCompaniesApi = () => api.get('/companies');
export const getCompanyBySlugApi = (slug) => api.get(`/companies/${slug}`);

// Mock Tests endpoints
export const getMockTestsApi = (params) => api.get('/mocktests', { params });
export const getMockTestBySlugApi = (slug) => api.get(`/mocktests/${slug}`);
export const submitMockTestApi = (slug, submission) => api.post(`/mocktests/${slug}/submit`, submission);

// Attempts endpoints
export const getMyAttemptsApi = () => api.get('/attempts/my');
export const getAttemptByIdApi = (id) => api.get(`/attempts/${id}`);

// Daily Challenge endpoints
export const getTodayChallengeApi = () => api.get('/challenges/today');
export const submitDailyChallengeApi = (submission) => api.post('/challenges/submit', submission);

// Global search
export const searchGlobalApi = (query, category) => api.get('/search', { params: { q: query, category } });

// Admin endpoints
export const getAdminStatsApi = () => api.get('/admin/stats');
export const getAdminUsersApi = () => api.get('/admin/users');
export const updateAdminUserRoleApi = (id, role) => api.put(`/admin/users/${id}/role`, { role });

export default api;
