import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const getBaseURL = () => {
  if (!rawBaseURL || rawBaseURL === '/api') return '/api';
  let url = rawBaseURL.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/api')) {
    url = `${url.replace(/\/$/, '')}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle expired token and unified errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired, unless we're already on login/register
      const isAuthEndpoint = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    
    // Extract server error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'An unexpected error occurred. Please try again.';
      
    error.customMessage = message;
    return Promise.reject(error);
  }
);

export default api;

