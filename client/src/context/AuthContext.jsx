import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, updateProfileApi, toggleBookmarkFormulaApi, toggleCompleteTopicApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ap_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('ap_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          setUser(res.data.user);
        } catch (err) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('ap_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('ap_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    setAuthModalOpen(false);
    return receivedUser;
  };

  const register = async (name, email, password, targetExam) => {
    const res = await registerApi({ name, email, password, targetExam });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('ap_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    setAuthModalOpen(false);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('ap_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await updateProfileApi(data);
    setUser(res.data.user);
    return res.data;
  };

  const toggleBookmarkFormula = async (formulaId) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return false;
    }
    const res = await toggleBookmarkFormulaApi(formulaId);
    setUser(prev => ({ ...prev, savedFormulas: res.data.savedFormulas }));
    return res.data.bookmarked;
  };

  const toggleCompleteTopic = async (topicSlug) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return false;
    }
    const res = await toggleCompleteTopicApi(topicSlug);
    setUser(prev => ({ ...prev, completedTopics: res.data.completedTopics }));
    return res.data.completed;
  };

  const openLoginModal = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      toggleBookmarkFormula,
      toggleCompleteTopic,
      authModalOpen,
      setAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      openLoginModal,
      openRegisterModal,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
