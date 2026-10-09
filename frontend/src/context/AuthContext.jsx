import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('minishop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('minishop_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('minishop_token');
    localStorage.removeItem('minishop_user');
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/getMe');
          if (res.data.success && isMounted) {
            setUser(res.data.innerData);
            localStorage.setItem('minishop_user', JSON.stringify(res.data.innerData));
          }
        } catch {
          if (isMounted) {
            logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    fetchMe();
    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data.innerData;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('minishop_token', newToken);
        localStorage.setItem('minishop_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const res = await axiosInstance.post('/auth/register', userData);
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data.innerData;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('minishop_token', newToken);
        localStorage.setItem('minishop_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  }, []);

  const updateProfile = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('minishop_user', JSON.stringify(updatedUser));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin',
      loading,
      login,
      register,
      logout,
      updateProfile
    }),
    [user, token, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
