import { Link } from 'react-router-dom';
import { dataBR, useApi, type Certificado, type Curso } from '../plataforma/util';

export default function Certificados() {
  const { dados: certificados, erro } = useApi<Certificado[]>('/certificados');
  const cursos = useApi<Curso[]>('/cursos').dados ?? [];

  return (
    <section>
      <h1>Meus certificados</h1>
      <p className="subtitulo">Conclua todas as aulas de um curso e emita o certificado na página dele.</p>
      {erro && <p className="erro">{erro}</p>}

      {!certificados ? (
        <p>Carregando…</p>
      ) : certificados.length === 0 ? (
        <p className="vazio">
          Nenhum certificado ainda. <Link to="/aluno/matriculas">Continue seus cursos</Link>
        </p>
      ) : (
        <div className="cards-cursos">
          {certificados.map((c) => (
            <Link key={c.idCertificado} to={`/aluno/certificados/${c.idCertificado}`} className="card card-curso">
              <span className="selo">🎓</span>
              <h3>{cursos.find((x) => x.idCurso === c.idCurso)?.titulo ?? `Curso #${c.idCurso}`}</h3>
              <p className="info">Emitido em {dataBR(c.dataEmissao)}</p>
              <p className="info">
                <code>{c.codigoVerificacao}</code>
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
