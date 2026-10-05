import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { inicioDoPerfil, useAuth } from './auth';
import { grupos, recursos } from './resources';

// Estrutura do painel do admin: menu lateral + conteúdo.
export default function Layout() {
  const { token, email, perfil, logout } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  // Professor e aluno têm áreas próprias.
  if (perfil !== 'ADMIN') return <Navigate to={inicioDoPerfil(perfil)} replace />;

  return (
    <div className="app">
      <aside>
        <Link to="/" className="logo">
          Cursos Online
        </Link>
        <nav>
          {grupos.map((g) => (
            <div key={g}>
              <p className="grupo">{g}</p>
              {recursos
                .filter((r) => r.grupo === g)
                .map((r) => (
                  <NavLink key={r.slug} to={`/${r.slug}`}>
                    {r.titulo}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
        <div className="usuario">
          <span title={email ?? ''}>{email} (admin)</span>
          <button className="secundario" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
