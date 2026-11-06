import axiosClient from './axiosClient.js';

const TASK_URL = import.meta.env.VITE_TASK_API_URL || 'http://localhost:5002/api/tasks';

export const taskApi = {
  // Get all tasks with query filter, search, sort
  getTasks: async (params = {}) => {
    const response = await axiosClient.get(TASK_URL, { params });
    return response.data;
  },

  // Get aggregated dashboard statistics
  getDashboardStats: async () => {
    const response = await axiosClient.get(`${TASK_URL}/dashboard`);
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (taskId) => {
    const response = await axiosClient.get(`${TASK_URL}/${taskId}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await axiosClient.post(TASK_URL, taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (taskId, updateData) => {
    const response = await axiosClient.put(`${TASK_URL}/${taskId}`, updateData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await axiosClient.delete(`${TASK_URL}/${taskId}`);
    return response.data;
  },
};

export default taskApi;

