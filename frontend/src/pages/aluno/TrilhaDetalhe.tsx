import { Link, useParams } from 'react-router-dom';
import { useApi, type Curso, type Matricula, type Trilha, type TrilhaCurso } from '../plataforma/util';

export default function TrilhaDetalhe() {
  const id = Number(useParams().id);
  const { dados: trilha, erro } = useApi<Trilha>(`/trilhas/${id}`);
  const trilhasCursos = useApi<TrilhaCurso[]>('/trilhas-cursos').dados ?? [];
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];
  const matriculas = useApi<Matricula[]>('/matriculas').dados ?? [];

  if (!trilha) return erro ? <p className="erro">{erro}</p> : <p>Carregando…</p>;

  const etapas = trilhasCursos.filter((tc) => tc.idTrilha === id).sort((a, b) => a.ordem - b.ordem);

  return (
    <section>
      <Link to="/aluno/trilhas" className="voltar">
        ← Voltar às trilhas
      </Link>
      <h1>{trilha.titulo}</h1>
      {trilha.descricao && <p className="subtitulo">{trilha.descricao}</p>}

      {etapas.length === 0 ? (
        <p className="vazio">Esta trilha ainda não tem cursos.</p>
      ) : (
        <ol className="etapas">
          {etapas.map((etapa) => {
            const curso = cursos.find((c) => c.idCurso === etapa.idCurso);
            return (
              <li key={etapa.idCurso} className="card">
                <span className="numero">{etapa.ordem}</span>
                <div>
                  <Link to={`/aluno/cursos/${etapa.idCurso}`}>
                    <strong>{curso?.titulo ?? `Curso #${etapa.idCurso}`}</strong>
                  </Link>
                  <p className="info">{curso?.instrutor?.nomeCompleto}</p>
                </div>
                {matriculas.some((m) => m.idCurso === etapa.idCurso) && <span className="etiqueta ok">Matriculado</span>}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
