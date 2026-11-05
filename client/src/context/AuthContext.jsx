import { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on app initialization
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response?.user) {
          setUser(response.user);
          localStorage.setItem('taskflow_user', JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    if (data.token && data.user) {
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    if (data.token && data.user) {
      localStorage.setItem('taskflow_token', data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
