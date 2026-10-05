import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, TOKEN_KEY } from './api';

// "USER" (aluno), "INSTRUTOR" (professor) ou "ADMIN"
export type Perfil = 'USER' | 'INSTRUTOR' | 'ADMIN';

type Auth = {
  token: string | null;
  idUsuario: number | null;
  email: string | null;
  perfil: Perfil | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Auth | null>(null);

type DadosToken = { sub: number; email: string; perfil: Perfil };

// Lê o payload de dentro do JWT ({ sub, email, perfil }).
// Qualquer um consegue LER o payload; só o backend (com o JWT_SECRET) consegue CRIAR um token válido.
function dadosDoToken(token: string | null): DadosToken | null {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

// Token antigo (sem perfil) não serve mais: obriga a entrar de novo.
function tokenSalvo() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !dadosDoToken(token)?.perfil) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

// Página inicial de cada tipo de conta.
export function inicioDoPerfil(perfil: Perfil | null) {
  if (perfil === 'ADMIN') return '/';
  if (perfil === 'INSTRUTOR') return '/professor';
  return '/aluno';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(tokenSalvo);

  useEffect(() => {
    const aoSair = () => setToken(null);
    window.addEventListener('auth:logout', aoSair);
    return () => window.removeEventListener('auth:logout', aoSair);
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await api<{ access_token: string }>('/auth/login', 'POST', { email, password });
    console.log('[login] token recebido:', access_token);
    console.log('[login] dados dentro do token:', dadosDoToken(access_token));
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  const dados = dadosDoToken(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        idUsuario: dados?.sub ?? null,
        email: dados?.email ?? null,
        perfil: dados?.perfil ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
