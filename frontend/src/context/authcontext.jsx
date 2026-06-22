import { createContext, useState, useContext } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { authenticated: true } : null;
  });

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    // Menggunakan username agar sinkron dengan backend FastAPI kamu
    formData.append('username', username);
    formData.append('password', password);

    const res = await api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    localStorage.setItem('token', res.data.access_token);
    setUser({ authenticated: true });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);