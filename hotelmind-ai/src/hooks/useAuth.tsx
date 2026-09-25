import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STATIC_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hotelmind_auth') === 'true';
  });

  function login(username: string, password: string): boolean {
    if (username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('hotelmind_auth', 'true');
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem('hotelmind_auth');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
