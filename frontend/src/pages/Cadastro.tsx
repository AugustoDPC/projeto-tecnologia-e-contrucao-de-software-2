import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Cadastro() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [nomeCompleto, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (token) return <Navigate to="/" replace />;

  async function cadastrar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await api('/usuarios', 'POST', { nomeCompleto, email, senha });
      // Já entra direto depois de criar a conta.
      await login(email, senha);
      navigate('/');
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="tela-auth">
      <form className="card" onSubmit={cadastrar}>
        <h1>Criar conta</h1>
        <label>
          Nome completo
          <input value={nomeCompleto} onChange={(e) => setNome(e.target.value)} required autoFocus />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            required
            autoComplete="new-password"
          />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Criando…' : 'Criar conta'}
        </button>
        <p className="rodape">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
