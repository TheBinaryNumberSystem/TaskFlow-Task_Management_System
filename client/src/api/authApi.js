import axiosClient from './axiosClient.js';

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001/api/auth';

export const authApi = {
  // Register a new user
  register: async (userData) => {
    const response = await axiosClient.post(`${AUTH_URL}/register`, userData);
    return response.data;
  },

  // Login existing user
  login: async (credentials) => {
    const response = await axiosClient.post(`${AUTH_URL}/login`, credentials);
    return response.data;
  },

  // Fetch current user profile via JWT
  getMe: async () => {
    const response = await axiosClient.get(`${AUTH_URL}/me`);
    return response.data;
  },

  // Verify employee email (Managers only)
  verifyEmployee: async (email) => {
    const response = await axiosClient.get(`${AUTH_URL}/verify-employee/${encodeURIComponent(email)}`);
    return response.data;
  },
};

export default authApi;

