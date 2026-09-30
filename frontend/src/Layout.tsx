import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth';
import { grupos, recursos } from './resources';

// Estrutura das páginas logadas: menu lateral + conteúdo.
export default function Layout() {
  const { token, email, logout } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

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
          <span title={email ?? ''}>{email}</span>
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
