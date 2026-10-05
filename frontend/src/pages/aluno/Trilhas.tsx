import { Link } from 'react-router-dom';
import { useApi, type Categoria, type Trilha, type TrilhaCurso } from '../plataforma/util';

// Trilhas = sequências de cursos sobre um tema.
export default function Trilhas() {
  const { dados: trilhas, erro } = useApi<Trilha[]>('/trilhas');
  const categorias = useApi<Categoria[]>('/categorias').dados ?? [];
  const trilhasCursos = useApi<TrilhaCurso[]>('/trilhas-cursos').dados ?? [];

  return (
    <section>
      <h1>Trilhas</h1>
      <p className="subtitulo">Sequências de cursos para aprender um tema do começo ao fim.</p>
      {erro && <p className="erro">{erro}</p>}

      {!trilhas ? (
        <p>Carregando…</p>
      ) : trilhas.length === 0 ? (
        <p className="vazio">Nenhuma trilha cadastrada ainda.</p>
      ) : (
        <div className="cards-cursos">
          {trilhas.map((t) => (
            <Link key={t.idTrilha} to={`/aluno/trilhas/${t.idTrilha}`} className="card card-curso">
              <div className="etiquetas">
                <span className="etiqueta">{categorias.find((c) => c.idCategoria === t.idCategoria)?.nome}</span>
              </div>
              <h3>{t.titulo}</h3>
              {t.descricao && <p className="descricao">{t.descricao}</p>}
              <p className="info">{trilhasCursos.filter((tc) => tc.idTrilha === t.idTrilha).length} curso(s)</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
