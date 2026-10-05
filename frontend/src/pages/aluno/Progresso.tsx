import { Link } from 'react-router-dom';
import { dataBR, useApi, type Aula, type Curso, type Progresso as ProgressoAula } from '../plataforma/util';

// Histórico das aulas que o aluno marcou.
export default function Progresso() {
  const { dados: progresso, erro } = useApi<ProgressoAula[]>('/progresso-aulas');
  const aulas = useApi<Aula[]>('/aulas').dados ?? [];
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];

  const ordenado = [...(progresso ?? [])].sort((a, b) => b.dataConclusao.localeCompare(a.dataConclusao));

  return (
    <section>
      <h1>Meu progresso</h1>
      <p className="subtitulo">As aulas que você já marcou. Para concluir uma aula, abra o curso.</p>
      {erro && <p className="erro">{erro}</p>}

      {!progresso ? (
        <p>Carregando…</p>
      ) : ordenado.length === 0 ? (
        <p className="vazio">
          Nenhuma aula concluída ainda. <Link to="/aluno/matriculas">Ir para minhas matrículas</Link>
        </p>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Aula</th>
                <th>Curso</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {ordenado.map((p) => {
                const aula = aulas.find((a) => a.idAula === p.idAula);
                const curso = cursos.find((c) => c.idCurso === aula?.idCurso);
                return (
                  <tr key={p.idAula}>
                    <td>{aula?.titulo ?? `Aula #${p.idAula}`}</td>
                    <td>{curso ? <Link to={`/aluno/cursos/${curso.idCurso}`}>{curso.titulo}</Link> : '—'}</td>
                    <td>{p.status}</td>
                    <td>{dataBR(p.dataConclusao)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
