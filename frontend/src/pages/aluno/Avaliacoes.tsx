import { Link } from 'react-router-dom';
import { api } from '../../api';
import { dataBR, estrelas, useApi, type Avaliacao, type Curso } from '../plataforma/util';

export default function Avaliacoes() {
  const { dados: avaliacoes, erro, recarregar } = useApi<Avaliacao[]>('/avaliacoes');
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];

  async function excluir(a: Avaliacao) {
    if (!confirm('Excluir esta avaliação?')) return;
    try {
      await api(`/avaliacoes/${a.idAvaliacao}`, 'DELETE');
      await recarregar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <section>
      <h1>Minhas avaliações</h1>
      <p className="subtitulo">Para avaliar ou mudar a nota, abra a página do curso.</p>
      {erro && <p className="erro">{erro}</p>}

      {!avaliacoes ? (
        <p>Carregando…</p>
      ) : avaliacoes.length === 0 ? (
        <p className="vazio">Você ainda não avaliou nenhum curso.</p>
      ) : (
        avaliacoes.map((a) => (
          <div key={a.idAvaliacao} className="card bloco">
            <div className="cabecalho-pagina">
              <div>
                <Link to={`/aluno/cursos/${a.idCurso}`}>
                  <strong>{cursos.find((c) => c.idCurso === a.idCurso)?.titulo ?? `Curso #${a.idCurso}`}</strong>
                </Link>
                <p className="info">
                  <span className="estrelas">{estrelas(a.nota)}</span> · {dataBR(a.dataAvaliacao)}
                </p>
              </div>
              <button className="perigo" onClick={() => excluir(a)}>
                Excluir
              </button>
            </div>
            {a.comentario && <p>{a.comentario}</p>}
          </div>
        ))
      )}
    </section>
  );
}
