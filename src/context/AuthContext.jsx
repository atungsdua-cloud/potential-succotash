import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUser, getStoredToken, logout as apiLogout, checkAuth } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [editMode, setEditMode] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      checkAuth().then(u => {
        if (u) setUser(u);
        else setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setEditMode(true);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setEditMode(false);
    setShowDashboard(false);
  };

  return (
    <AuthContext.Provider value={{ user, editMode, setEditMode, login, logout, loading, showDashboard, setShowDashboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
