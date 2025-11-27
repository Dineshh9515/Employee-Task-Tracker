import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const loginWithToken = async (token) => {
    try {
      localStorage.setItem('token', token);
      const response = await api.get('/auth/me');
      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      return { success: false, message: 'Invalid token' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    loginWithToken,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
