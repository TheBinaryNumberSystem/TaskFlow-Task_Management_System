import { createContext, useContext, useState, useCallback } from 'react';
import taskApi from '../api/taskApi.js';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  order: 'desc',
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch tasks with current or overridden filters
  const fetchTasks = useCallback(async (customFilters = null) => {
    setLoadingTasks(true);
    try {
      const activeFilters = customFilters || filters;
      // Clean empty string query params
      const cleanedParams = {};
      Object.keys(activeFilters).forEach((key) => {
        if (key !== 'onlyMyTasks' && activeFilters[key] !== '') {
          cleanedParams[key] = activeFilters[key];
        }
      });

      const response = await taskApi.getTasks(cleanedParams);
      if (response?.tasks) {
        setTasks(response.tasks);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, [filters]);

  // Fetch dashboard overview metrics
  const fetchDashboardStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const response = await taskApi.getDashboardStats();
      if (response?.stats) {
        setDashboardStats(response.stats);
      }
    } catch (err) {
      console.error('Dashboard stats error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Create a new task
  const createTask = async (taskData) => {
    try {
      const response = await taskApi.createTask(taskData);
      if (response?.task) {
        setTasks((prev) => [response.task, ...prev]);
        toast.success('Task created successfully!');
        fetchDashboardStats();
        return response.task;
      }
    } catch (err) {
      console.error('Create task error details:', err);
      const msg = err.response?.data?.message || err.message || 'Could not create task';
      toast.error(msg);
      throw err;
    }
  };

  // Update existing task
  const updateTask = async (taskId, updateData) => {
    try {
      const response = await taskApi.updateTask(taskId, updateData);
      if (response?.task) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? response.task : t))
        );
        toast.success('Task updated successfully!');
        fetchDashboardStats();
        return response.task;
      }
    } catch (err) {
      console.error('Update task error details:', err);
      const msg = err.response?.data?.message || err.message || 'Could not update task';
      toast.error(msg);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted successfully!');
      fetchDashboardStats();
    } catch (err) {
      console.error('Delete task error details:', err);
      const msg = err.response?.data?.message || err.message || 'Could not delete task';
      toast.error(msg);
      throw err;
    }
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const value = {
    tasks,
    dashboardStats,
    filters,
    loadingTasks,
    loadingStats,
    fetchTasks,
    fetchDashboardStats,
    createTask,
    updateTask,
    deleteTask,
    updateFilters,
    resetFilters,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
