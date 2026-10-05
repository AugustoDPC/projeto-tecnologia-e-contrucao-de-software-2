import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, type Categoria, type Curso, type Matricula } from '../plataforma/util';

// Catálogo: todos os cursos, com busca e filtro por categoria.
export default function Cursos() {
  const { dados: cursos, erro } = useApi<Curso[]>('/cursos');
  const categorias = useApi<Categoria[]>('/categorias').dados ?? [];
  const matriculas = useApi<Matricula[]>('/matriculas').dados ?? [];
  const [busca, setBusca] = useState('');
  const [idCategoria, setIdCategoria] = useState('');

  const filtrados = (cursos ?? []).filter(
    (c) =>
      c.titulo.toLowerCase().includes(busca.toLowerCase()) &&
      (!idCategoria || c.idCategoria === Number(idCategoria)),
  );
  const nomeCategoria = (id: number) => categorias.find((c) => c.idCategoria === id)?.nome ?? '';

  return (
    <section>
      <h1>Cursos</h1>
      <p className="subtitulo">Escolha um curso para ver os módulos, as aulas e se matricular.</p>

      <div className="filtros">
        <input placeholder="Buscar curso…" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {!cursos ? (
        <p>Carregando…</p>
      ) : filtrados.length === 0 ? (
        <p className="vazio">Nenhum curso encontrado.</p>
      ) : (
        <div className="cards-cursos">
          {filtrados.map((c) => (
            <Link key={c.idCurso} to={`/aluno/cursos/${c.idCurso}`} className="card card-curso">
              <div className="etiquetas">
                <span className="etiqueta">{nomeCategoria(c.idCategoria)}</span>
                {matriculas.some((m) => m.idCurso === c.idCurso) && <span className="etiqueta ok">Matriculado</span>}
              </div>
              <h3>{c.titulo}</h3>
              {c.descricao && <p className="descricao">{c.descricao}</p>}
              <p className="info">
                {[c.nivel, c.totalHoras && `${c.totalHoras}h`, c.instrutor?.nomeCompleto].filter(Boolean).join(' · ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
