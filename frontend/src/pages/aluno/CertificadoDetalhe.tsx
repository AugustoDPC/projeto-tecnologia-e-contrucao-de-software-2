import { Link, useParams } from 'react-router-dom';
import { dataBR, useApi, type Certificado, type Curso, type Usuario } from '../plataforma/util';

// O certificado "de verdade", pronto para imprimir (ou salvar como PDF pelo navegador).
export default function CertificadoDetalhe() {
  const id = useParams().id;
  const { dados: certificado, erro } = useApi<Certificado>(`/certificados/${id}`);
  const curso = useApi<Curso>(certificado ? `/cursos/${certificado.idCurso}` : null).dados;
  const eu = useApi<Usuario>('/usuarios/me').dados;

  if (!certificado) return erro ? <p className="erro">{erro}</p> : <p>Carregando…</p>;

  return (
    <section>
      <div className="cabecalho-pagina nao-imprimir">
        <Link to="/aluno/certificados" className="voltar">
          ← Meus certificados
        </Link>
        <button onClick={() => window.print()}>Imprimir / salvar PDF</button>
      </div>

      <div className="card certificado">
        <p className="info">CERTIFICADO DE CONCLUSÃO</p>
        <p>Certificamos que</p>
        <h1>{eu?.nomeCompleto}</h1>
        <p>concluiu o curso</p>
        <h2>{curso?.titulo}</h2>
        {curso?.totalHoras ? <p>com carga horária de {curso.totalHoras} horas,</p> : null}
        <p>em {dataBR(certificado.dataEmissao)}.</p>
        {curso?.instrutor && <p className="info">Instrutor: {curso.instrutor.nomeCompleto}</p>}
        <p className="info">
          Código de verificação: <code>{certificado.codigoVerificacao}</code>
        </p>
      </div>
    </section>
  );
}
