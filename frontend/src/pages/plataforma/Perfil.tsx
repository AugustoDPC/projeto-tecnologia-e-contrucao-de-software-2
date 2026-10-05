import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../../api';
import { dataBR, useApi, type Usuario } from './util';

// "Meu perfil": igual para aluno e professor.
export default function Perfil() {
  const { dados: eu, erro: erroCarregar } = useApi<Usuario>('/usuarios/me');
  const [nomeCompleto, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (eu) {
      setNome(eu.nomeCompleto);
      setEmail(eu.email);
    }
  }, [eu]);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setAviso('');
    if (senha !== confirmacao) {
      setErro('A confirmação não é igual à nova senha.');
      return;
    }
    setSalvando(true);
    try {
      // Senha em branco = mantém a atual.
      await api('/usuarios/me', 'PATCH', { nomeCompleto, email, ...(senha ? { senha } : {}) });
      setSenha('');
      setConfirmacao('');
      setAviso('Perfil atualizado!');
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section>
      <h1>Meu perfil</h1>
      {eu && (
        <p className="subtitulo">
          Conta de {eu.perfil === 'INSTRUTOR' ? 'professor' : 'aluno'} · membro desde {dataBR(eu.dataCadastro)}
        </p>
      )}
      {erroCarregar && <p className="erro">{erroCarregar}</p>}

      <form className="card formulario" onSubmit={salvar}>
        <h2>Dados pessoais</h2>
        <div className="grade">
          <label>
            Nome completo
            <input value={nomeCompleto} onChange={(e) => setNome(e.target.value)} required />
          </label>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>

        <h2>Trocar senha</h2>
        <p className="info">Deixe em branco para manter a senha atual.</p>
        <div className="grade">
          <label>
            Nova senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <label>
            Confirmar nova senha
            <input
              type="password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {aviso && <p className="sucesso">{aviso}</p>}
        <div className="botoes">
          <button type="submit" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </section>
  );
}
