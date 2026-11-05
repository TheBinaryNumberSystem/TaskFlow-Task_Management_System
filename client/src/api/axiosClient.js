import axios from 'axios';

// Base Axios instance
const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to inject JWT Bearer token into headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 Unauthorized responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid, unless on login/register endpoints
      const url = error.config?.url || '';
      if (!url.includes('/login') && !url.includes('/register')) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

