import { Link } from 'react-router-dom';
import { api } from '../../api';
import {
  BarraProgresso,
  dataBR,
  progressoDoCurso,
  useApi,
  type Aula,
  type Curso,
  type Matricula,
  type Progresso,
} from '../plataforma/util';

export default function Matriculas() {
  const { dados: matriculas, erro, recarregar } = useApi<Matricula[]>('/matriculas');
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];
  const aulas = useApi<Aula[]>('/aulas').dados ?? [];
  const progresso = useApi<Progresso[]>('/progresso-aulas').dados ?? [];

  async function cancelar(m: Matricula) {
    if (!confirm('Cancelar esta matrícula?')) return;
    try {
      await api(`/matriculas/${m.idMatricula}`, 'DELETE');
      await recarregar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <section>
      <h1>Minhas matrículas</h1>
      <p className="subtitulo">Os cursos em que você está matriculado e o seu progresso.</p>
      {erro && <p className="erro">{erro}</p>}

      {!matriculas ? (
        <p>Carregando…</p>
      ) : matriculas.length === 0 ? (
        <p className="vazio">
          Você ainda não está em nenhum curso. <Link to="/aluno/cursos">Ver catálogo</Link>
        </p>
      ) : (
        <div className="cards-cursos">
          {matriculas.map((m) => {
            const p = progressoDoCurso(m.idCurso, aulas, progresso);
            return (
              <div key={m.idMatricula} className="card card-curso">
                <h3>{cursos.find((c) => c.idCurso === m.idCurso)?.titulo ?? `Curso #${m.idCurso}`}</h3>
                <p className="info">
                  Desde {dataBR(m.dataMatricula)} · {p.feitas} de {p.total} aulas
                </p>
                <BarraProgresso feitas={p.feitas} total={p.total} />
                <div className="botoes">
                  <Link to={`/aluno/cursos/${m.idCurso}`} className="botao-link">
                    Continuar
                  </Link>
                  <button className="perigo" onClick={() => cancelar(m)}>
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
