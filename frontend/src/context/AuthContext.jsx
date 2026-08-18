import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('studybuddy_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('studybuddy_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('studybuddy_token', token);
    else localStorage.removeItem('studybuddy_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('studybuddy_user', JSON.stringify(user));
    else localStorage.removeItem('studybuddy_user');
  }, [user]);

  async function login(email, password) {
    const data = await api.login({ email, password });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
