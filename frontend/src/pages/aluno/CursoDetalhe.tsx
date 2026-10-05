import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../auth';
import {
  BarraProgresso,
  CONCLUIDA,
  dataBR,
  estrelas,
  progressoDoCurso,
  useApi,
  type Aula,
  type Avaliacao,
  type Categoria,
  type Certificado,
  type Curso,
  type Matricula,
  type Modulo,
  type Progresso,
} from '../plataforma/util';

type Elegibilidade = { totalAulas: number; aulasConcluidas: number; concluiu: boolean; jaEmitido: boolean };

export default function CursoDetalhe() {
  const id = Number(useParams().id);
  const { idUsuario } = useAuth();

  const { dados: curso, erro: erroCurso } = useApi<Curso>(`/cursos/${id}`);
  const categorias = useApi<Categoria[]>('/categorias').dados ?? [];
  const modulos = (useApi<Modulo[]>('/modulos').dados ?? []).filter((m) => m.idCurso === id);
  const aulasApi = useApi<Aula[]>('/aulas');
  const matriculasApi = useApi<Matricula[]>('/matriculas');
  const progressoApi = useApi<Progresso[]>('/progresso-aulas');
  const avaliacoesApi = useApi<Avaliacao[]>('/avaliacoes');
  const certificadosApi = useApi<Certificado[]>('/certificados');
  const elegibilidadeApi = useApi<Elegibilidade>(`/certificados/elegibilidade/${id}`);

  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  const aulas = (aulasApi.dados ?? []).filter((a) => a.idCurso === id);
  const progresso = progressoApi.dados ?? [];
  const matricula = matriculasApi.dados?.find((m) => m.idCurso === id);
  const minhaAvaliacao = avaliacoesApi.dados?.find((a) => a.idCurso === id) ?? null;
  const certificado = certificadosApi.dados?.find((c) => c.idCurso === id);
  const elegibilidade = elegibilidadeApi.dados;

  // Chama a API, mostra a mensagem e recarrega o que mudou.
  async function acao(chamada: () => Promise<unknown>, mensagem: string, recarregar: (() => Promise<void>)[]) {
    setErro('');
    setAviso('');
    try {
      await chamada();
      setAviso(mensagem);
      await Promise.all(recarregar.map((r) => r()));
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  if (!curso) return erroCurso ? <p className="erro">{erroCurso}</p> : <p>Carregando…</p>;

  const p = progressoDoCurso(id, aulas, progresso);
  const feita = (aula: Aula) => progresso.some((x) => x.idAula === aula.idAula && x.status === CONCLUIDA);
  const aposMatricula = [matriculasApi.recarregar, aulasApi.recarregar, elegibilidadeApi.recarregar];
  const aposProgresso = [progressoApi.recarregar, elegibilidadeApi.recarregar];

  function matricular() {
    acao(() => api('/matriculas', 'POST', { idUsuario, idCurso: id }), 'Matrícula feita! Bons estudos.', aposMatricula);
  }

  function cancelarMatricula() {
    if (!matricula || !confirm('Cancelar sua matrícula neste curso?')) return;
    acao(() => api(`/matriculas/${matricula.idMatricula}`, 'DELETE'), 'Matrícula cancelada.', aposMatricula);
  }

  function concluir(aula: Aula) {
    const existente = progresso.find((x) => x.idAula === aula.idAula);
    const dados = { status: CONCLUIDA, dataConclusao: new Date().toISOString() };
    // Já tem registro (ex.: "Em andamento")? Atualiza. Senão, cria.
    const chamada = existente
      ? () => api(`/progresso-aulas/${idUsuario}/${aula.idAula}`, 'PATCH', dados)
      : () => api('/progresso-aulas', 'POST', { idUsuario, idAula: aula.idAula, ...dados });
    acao(chamada, `Aula "${aula.titulo}" concluída!`, aposProgresso);
  }

  function emitirCertificado() {
    acao(
      () => api('/certificados', 'POST', { idUsuario, idCurso: id }),
      'Certificado emitido! Veja em Meus certificados. 🎓',
      [certificadosApi.recarregar, elegibilidadeApi.recarregar],
    );
  }

  function avaliar(nota: number, comentario: string) {
    const corpo = { nota, ...(comentario ? { comentario } : {}) };
    const chamada = minhaAvaliacao
      ? () => api(`/avaliacoes/${minhaAvaliacao.idAvaliacao}`, 'PATCH', { ...corpo, dataAvaliacao: new Date().toISOString() })
      : () => api('/avaliacoes', 'POST', { idUsuario, idCurso: id, ...corpo });
    acao(chamada, 'Avaliação salva!', [avaliacoesApi.recarregar]);
  }

  return (
    <section>
      <Link to="/aluno/cursos" className="voltar">
        ← Voltar ao catálogo
      </Link>

      <div className="cabecalho-pagina">
        <div>
          <div className="etiquetas">
            <span className="etiqueta">{categorias.find((c) => c.idCategoria === curso.idCategoria)?.nome}</span>
            {matricula && <span className="etiqueta ok">Matriculado</span>}
          </div>
          <h1>{curso.titulo}</h1>
          <p className="info">
            {[curso.nivel, curso.totalHoras && `${curso.totalHoras}h`, `Instrutor: ${curso.instrutor?.nomeCompleto}`]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
        {matricula ? (
          <button className="perigo" onClick={cancelarMatricula}>
            Cancelar matrícula
          </button>
        ) : (
          <button onClick={matricular}>Matricular-se</button>
        )}
      </div>

      {curso.descricao && <p>{curso.descricao}</p>}
      {erro && <p className="erro">{erro}</p>}
      {aviso && <p className="sucesso">{aviso}</p>}

      {matricula && (
        <div className="card bloco">
          <p>
            <strong>Seu progresso:</strong> {p.feitas} de {p.total} aulas · matriculado em {dataBR(matricula.dataMatricula)}
          </p>
          <BarraProgresso feitas={p.feitas} total={p.total} />
          {certificado ? (
            <p>
              🎓 Certificado emitido em {dataBR(certificado.dataEmissao)}.{' '}
              <Link to={`/aluno/certificados/${certificado.idCertificado}`}>Ver certificado</Link>
            </p>
          ) : elegibilidade?.concluiu ? (
            <p>
              <strong>Curso concluído!</strong> Você já pode emitir o seu certificado.{' '}
              <button onClick={emitirCertificado}>Emitir certificado</button>
            </p>
          ) : (
            <p className="info">Conclua todas as aulas para liberar o certificado.</p>
          )}
        </div>
      )}

      <h2>Conteúdo do curso</h2>
      {!matricula && aulas.length > 0 && (
        <p className="vazio">🔒 Você pode ver a lista de aulas, mas precisa se matricular para acessar o conteúdo.</p>
      )}
      {modulos.length === 0 ? (
        <p className="vazio">Este curso ainda não tem módulos.</p>
      ) : (
        [...modulos]
          .sort((a, b) => a.ordem - b.ordem)
          .map((m) => {
            const doModulo = aulas.filter((a) => a.idModulo === m.idModulo).sort((a, b) => a.ordem - b.ordem);
            return (
              <div key={m.idModulo} className="card bloco">
                <h3>
                  Módulo {m.ordem}: {m.titulo}
                </h3>
                {doModulo.length === 0 ? (
                  <p className="vazio">Sem aulas.</p>
                ) : (
                  <ul className="aulas">
                    {doModulo.map((a) => (
                      <li key={a.idAula} className={feita(a) ? 'concluida' : ''}>
                        <span className="check">{!a.liberada ? '🔒' : feita(a) ? '✓' : '○'}</span>
                        <span className="titulo-aula">
                          {a.titulo}
                          <small>
                            {a.tipoConteudo}
                            {a.duracaoMinutos ? ` · ${a.duracaoMinutos} min` : ''}
                          </small>
                        </span>
                        {a.urlConteudo && (
                          <a href={a.urlConteudo} target="_blank" rel="noreferrer">
                            Abrir
                          </a>
                        )}
                        {matricula && !feita(a) && (
                          <button className="secundario" onClick={() => concluir(a)}>
                            Concluir
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
      )}

      {matricula && (
        <>
          <h2>Sua avaliação</h2>
          <FormAvaliacao key={minhaAvaliacao?.idAvaliacao ?? 'nova'} atual={minhaAvaliacao} onSalvar={avaliar} />
        </>
      )}
    </section>
  );
}

function FormAvaliacao({ atual, onSalvar }: { atual: Avaliacao | null; onSalvar: (nota: number, comentario: string) => void }) {
  const [nota, setNota] = useState(atual?.nota ?? 5);
  const [comentario, setComentario] = useState(atual?.comentario ?? '');

  function enviar(e: FormEvent) {
    e.preventDefault();
    onSalvar(nota, comentario);
  }

  return (
    <form className="card formulario" onSubmit={enviar}>
      <div className="grade">
        <label>
          Nota
          <select value={nota} onChange={(e) => setNota(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {estrelas(n)} ({n})
              </option>
            ))}
          </select>
        </label>
        <label className="largo">
          Comentário (opcional)
          <textarea rows={2} value={comentario} onChange={(e) => setComentario(e.target.value)} />
        </label>
      </div>
      <div className="botoes">
        <button type="submit">{atual ? 'Atualizar avaliação' : 'Enviar avaliação'}</button>
      </div>
    </form>
  );
}
