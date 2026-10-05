import { Link } from 'react-router-dom';
import { useAuth } from '../../auth';
import {
  dataBR,
  Estatistica,
  estrelas,
  media,
  useApi,
  type Aula,
  type Avaliacao,
  type Curso,
  type Matricula,
  type Modulo,
  type Usuario,
} from '../plataforma/util';

// Painel do professor: os cursos DELE e como estão as turmas.
export default function Inicio() {
  const { idUsuario } = useAuth();
  const eu = useApi<Usuario>('/usuarios/me').dados;
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];
  const modulos = useApi<Modulo[]>('/modulos').dados ?? [];
  const aulas = useApi<Aula[]>('/aulas').dados ?? [];
  const matriculas = useApi<Matricula[]>('/matriculas').dados ?? [];
  const avaliacoes = useApi<Avaliacao[]>('/avaliacoes').dados ?? [];
  const alunos = useApi<Usuario[]>('/usuarios?perfil=USER').dados ?? [];

  const meusCursos = cursos.filter((c) => c.idInstrutor === idUsuario);
  const meusIds = meusCursos.map((c) => c.idCurso);
  const minhasMatriculas = matriculas.filter((m) => meusIds.includes(m.idCurso));
  const minhasAvaliacoes = avaliacoes.filter((a) => meusIds.includes(a.idCurso));
  const mediaGeral = media(minhasAvaliacoes.map((a) => a.nota));

  const nomeAluno = (id: number) => alunos.find((u) => u.idUsuario === id)?.nomeCompleto ?? `Aluno #${id}`;
  const tituloCurso = (id: number) => cursos.find((c) => c.idCurso === id)?.titulo ?? `Curso #${id}`;

  return (
    <section>
      <h1>Olá, prof. {eu?.nomeCompleto.split(' ')[0] ?? '…'}!</h1>
      <p className="subtitulo">Você cuida dos seus cursos, módulos e aulas, e acompanha os alunos.</p>

      <div className="estatisticas">
        <Estatistica valor={meusCursos.length} rotulo="meus cursos" />
        <Estatistica valor={aulas.filter((a) => meusIds.includes(a.idCurso)).length} rotulo="aulas publicadas" />
        <Estatistica valor={new Set(minhasMatriculas.map((m) => m.idUsuario)).size} rotulo="alunos matriculados" />
        <Estatistica valor={mediaGeral === null ? '—' : mediaGeral.toFixed(1)} rotulo="nota média" />
      </div>

      <div className="cabecalho-pagina espaco">
        <h2>Meus cursos</h2>
        <Link to="/professor/cursos" className="botao-link">
          + Novo curso
        </Link>
      </div>
      {meusCursos.length === 0 ? (
        <p className="vazio">Você ainda não tem cursos. Comece criando um em Catálogo → Cursos.</p>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Curso</th>
                <th>Módulos</th>
                <th>Aulas</th>
                <th>Alunos</th>
                <th>Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {meusCursos.map((c) => {
                const notas = minhasAvaliacoes.filter((a) => a.idCurso === c.idCurso).map((a) => a.nota);
                const m = media(notas);
                return (
                  <tr key={c.idCurso}>
                    <td>{c.titulo}</td>
                    <td>{modulos.filter((x) => x.idCurso === c.idCurso).length}</td>
                    <td>{aulas.filter((x) => x.idCurso === c.idCurso).length}</td>
                    <td>{minhasMatriculas.filter((x) => x.idCurso === c.idCurso).length}</td>
                    <td>{m === null ? '—' : `${m.toFixed(1)} (${notas.length})`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="espaco">Últimas avaliações dos seus cursos</h2>
      {minhasAvaliacoes.length === 0 ? (
        <p className="vazio">Nenhuma avaliação ainda.</p>
      ) : (
        [...minhasAvaliacoes]
          .sort((a, b) => b.dataAvaliacao.localeCompare(a.dataAvaliacao))
          .slice(0, 5)
          .map((a) => (
            <div key={a.idAvaliacao} className="card bloco">
              <span className="estrelas">{estrelas(a.nota)}</span> <strong>{nomeAluno(a.idUsuario)}</strong> em{' '}
              {tituloCurso(a.idCurso)} <span className="info">· {dataBR(a.dataAvaliacao)}</span>
              {a.comentario && <p>{a.comentario}</p>}
            </div>
          ))
      )}
    </section>
  );
}
