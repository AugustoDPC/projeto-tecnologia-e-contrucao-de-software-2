import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, TOKEN_KEY } from './api';

type Auth = {
  token: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Auth | null>(null);

// Lê o e-mail de dentro do JWT (payload { sub, email }).
function emailDoToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.email ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    const aoSair = () => setToken(null);
    window.addEventListener('auth:logout', aoSair);
    return () => window.removeEventListener('auth:logout', aoSair);
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await api<{ access_token: string }>('/auth/login', 'POST', { email, password });
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, email: emailDoToken(token), login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
