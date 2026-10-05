import { Link } from 'react-router-dom';
import { api } from '../../api';
import { assinaturaAtiva, dataBR, reais, useApi, type Assinatura } from '../plataforma/util';

export default function Assinaturas() {
  const { dados: assinaturas, erro, recarregar } = useApi<Assinatura[]>('/assinaturas');
  const ativa = assinaturaAtiva(assinaturas ?? []);

  // Cancelar = encerrar a assinatura hoje (o histórico continua guardado).
  async function cancelar(a: Assinatura) {
    if (!confirm('Cancelar sua assinatura? Ela termina hoje.')) return;
    try {
      await api(`/assinaturas/${a.idAssinatura}`, 'PATCH', { dataFim: new Date().toISOString() });
      await recarregar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <section>
      <h1>Minhas assinaturas</h1>
      <p className="subtitulo">
        Seu plano atual e o histórico. Para assinar, vá em <Link to="/aluno/planos">Planos</Link>.
      </p>
      {erro && <p className="erro">{erro}</p>}

      {!assinaturas ? (
        <p>Carregando…</p>
      ) : assinaturas.length === 0 ? (
        <p className="vazio">Você ainda não assinou nenhum plano.</p>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Plano</th>
                <th>Preço</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {assinaturas.map((a) => (
                <tr key={a.idAssinatura}>
                  <td>{a.plano.nome}</td>
                  <td>{reais(a.plano.preco)}</td>
                  <td>{dataBR(a.dataInicio)}</td>
                  <td>{dataBR(a.dataFim)}</td>
                  <td>{a === ativa ? <span className="etiqueta ok">Ativa</span> : 'Encerrada'}</td>
                  <td className="acoes">
                    {a === ativa && (
                      <button className="perigo" onClick={() => cancelar(a)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
