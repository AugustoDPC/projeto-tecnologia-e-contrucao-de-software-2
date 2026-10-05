import { Link } from 'react-router-dom';
import {
  assinaturaAtiva,
  BarraProgresso,
  CONCLUIDA,
  Estatistica,
  progressoDoCurso,
  useApi,
  type Assinatura,
  type Aula,
  type Certificado,
  type Curso,
  type Matricula,
  type Progresso,
  type Usuario,
} from '../plataforma/util';

// Painel do aluno: resumo e "continue de onde parou".
export default function Inicio() {
  const eu = useApi<Usuario>('/usuarios/me').dados;
  const matriculas = useApi<Matricula[]>('/matriculas').dados ?? [];
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];
  const aulas = useApi<Aula[]>('/aulas').dados ?? [];
  const progresso = useApi<Progresso[]>('/progresso-aulas').dados ?? [];
  const certificados = useApi<Certificado[]>('/certificados').dados ?? [];
  const assinaturas = useApi<Assinatura[]>('/assinaturas').dados ?? [];

  const ativa = assinaturaAtiva(assinaturas);
  const curso = (id: number) => cursos.find((c) => c.idCurso === id);
  const naoMatriculados = cursos.filter((c) => !matriculas.some((m) => m.idCurso === c.idCurso)).slice(0, 3);

  return (
    <section>
      <h1>Olá, {eu?.nomeCompleto.split(' ')[0] ?? '…'}!</h1>
      <p className="subtitulo">Bom te ver por aqui. Continue de onde parou.</p>

      <div className="estatisticas">
        <Estatistica valor={matriculas.length} rotulo="cursos matriculados" />
        <Estatistica valor={progresso.filter((p) => p.status === CONCLUIDA).length} rotulo="aulas concluídas" />
        <Estatistica valor={certificados.length} rotulo="certificados" />
        <Estatistica valor={ativa ? ativa.plano.nome : 'Nenhum'} rotulo="plano atual" />
      </div>

      {!ativa && (
        <p className="aviso">
          Você ainda não tem um plano ativo. <Link to="/aluno/planos">Conheça os planos</Link>.
        </p>
      )}

      <h2 className="espaco">Continue estudando</h2>
      {matriculas.length === 0 ? (
        <p className="vazio">
          Você ainda não está em nenhum curso. <Link to="/aluno/cursos">Ver catálogo</Link>
        </p>
      ) : (
        <div className="cards-cursos">
          {matriculas.map((m) => {
            const p = progressoDoCurso(m.idCurso, aulas, progresso);
            return (
              <Link key={m.idMatricula} to={`/aluno/cursos/${m.idCurso}`} className="card card-curso">
                <h3>{curso(m.idCurso)?.titulo ?? `Curso #${m.idCurso}`}</h3>
                <p className="info">
                  {p.feitas} de {p.total} aulas
                </p>
                <BarraProgresso feitas={p.feitas} total={p.total} />
              </Link>
            );
          })}
        </div>
      )}

      {naoMatriculados.length > 0 && (
        <>
          <h2 className="espaco">Que tal começar um destes?</h2>
          <div className="cards-cursos">
            {naoMatriculados.map((c) => (
              <Link key={c.idCurso} to={`/aluno/cursos/${c.idCurso}`} className="card card-curso">
                <h3>{c.titulo}</h3>
                {c.descricao && <p className="descricao">{c.descricao}</p>}
                <p className="info">{c.instrutor?.nomeCompleto}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
