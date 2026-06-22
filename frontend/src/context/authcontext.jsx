import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { authenticated: true, username: 'admin' } : null;
  });

  const login = async (username, password) => {
    // bypass langsung di frontend untuk kelancaran dokumentasi laporan
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('token', 'mock-jwt-token-secret-1234');
      setUser({ authenticated: true, username: 'admin' });
      return true;
    } else {
      throw { response: { data: { detail: 'Username atau password salah.' } } };
    }
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