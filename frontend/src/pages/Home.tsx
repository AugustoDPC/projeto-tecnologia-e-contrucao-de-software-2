import { Link } from 'react-router-dom';
import { grupos, recursos } from '../resources';

export default function Home() {
  return (
    <section>
      <h1>Plataforma de Cursos</h1>
      <p className="subtitulo">Escolha uma tabela para listar, cadastrar, editar ou excluir registros.</p>
      {grupos.map((g) => (
        <div key={g} className="grupo-home">
          <h2>{g}</h2>
          <div className="cards">
            {recursos
              .filter((r) => r.grupo === g)
              .map((r) => (
                <Link key={r.slug} to={`/${r.slug}`} className="card card-link">
                  {r.titulo}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
