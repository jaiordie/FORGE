import axios from 'axios';
import { User, DashboardData, Job, QuoteRequest, JobRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('forge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('forge_token');
      localStorage.removeItem('forge_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
};

export const plumberAPI = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/plumber/dashboard');
    return response.data;
  },

  getJobs: async (): Promise<{ jobs: Job[] }> => {
    const response = await api.get('/plumber/jobs');
    return response.data;
  },

  updateAvailability: async (isActive: boolean) => {
    const response = await api.put('/plumber/availability', { isActive });
    return response.data;
  },

  updatePreferences: async (preferences: {
    preferredJobTypes: string[];
    maxDistanceKm: number;
    [key: string]: any;
  }) => {
    const response = await api.put('/plumber/preferences', preferences);
    return response.data;
  },
};

export const jobAPI = {
  create: async (jobData: JobRequest) => {
    const response = await api.post('/job', jobData);
    return response.data;
  },

  submitQuote: async (jobId: string, quoteData: QuoteRequest) => {
    const response = await api.post(`/job/${jobId}/quote`, quoteData);
    return response.data;
  },

  updateStatus: async (jobId: string, status: string, additionalData?: any) => {
    const response = await api.post(`/job/${jobId}/status`, {
      status,
      ...additionalData,
    });
    return response.data;
  },

  uploadPhoto: async (jobId: string, file: File, caption?: string) => {
    const formData = new FormData();
    formData.append('photo', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await api.post(`/job/${jobId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createReview: async (jobId: string, rating: number, comment?: string) => {
    const response = await api.post(`/job/${jobId}/review`, {
      rating,
      comment,
    });
    return response.data;
  },
};

export default api;