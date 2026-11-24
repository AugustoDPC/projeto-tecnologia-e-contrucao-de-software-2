import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, dadosDoToken, usarToken } from './api';

// Guarda quem está logado e deixa disponível para todas as telas.
// Uso numa tela: const { usuario, entrar, sair } = useAuth();
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const CHAVE = 'token';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [iniciando, setIniciando] = useState(true);

  // Com o token em mãos, busca nome e e-mail em GET /usuarios/:id
  async function abrirSessao(jwt) {
    usarToken(jwt);
    const { sub } = dadosDoToken(jwt);
    setUsuario(await api(`/usuarios/${sub}`));
  }

  async function entrar(email, password) {
    const { access_token } = await api('/auth/login', 'POST', { email, password });
    await abrirSessao(access_token);
    await AsyncStorage.setItem(CHAVE, access_token); // fica salvo no celular
  }

  async function cadastrar(nomeCompleto, email, senha) {
    await api('/auth/cadastrar', 'POST', { nomeCompleto, email, senha });
    await entrar(email, senha); // já entra depois de criar a conta
  }

  async function sair() {
    usarToken(null);
    setUsuario(null);
    await AsyncStorage.removeItem(CHAVE);
  }

  // Ao abrir o app: se tem token salvo, entra direto
  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((jwt) => jwt && abrirSessao(jwt))
      .catch(() => sair())
      .finally(() => setIniciando(false));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, iniciando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
