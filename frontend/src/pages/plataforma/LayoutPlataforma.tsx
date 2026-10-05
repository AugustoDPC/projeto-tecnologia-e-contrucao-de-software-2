import type { MouseEvent } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { inicioDoPerfil, useAuth } from '../../auth';
import { iniciais, useApi, type Usuario } from './util';

type Secao = { titulo: string; itens: { para: string; texto: string }[] };

// O menu muda conforme o perfil. Esconder item não é segurança (quem barra é a API),
// mas evita mostrar uma tela que só daria 403.
const MENU_ALUNO: Secao[] = [
  {
    titulo: 'Catálogo',
    itens: [
      { para: '/aluno/cursos', texto: 'Cursos' },
      { para: '/aluno/trilhas', texto: 'Trilhas' },
    ],
  },
  {
    titulo: 'Meus estudos',
    itens: [
      { para: '/aluno/matriculas', texto: 'Minhas matrículas' },
      { para: '/aluno/progresso', texto: 'Meu progresso' },
      { para: '/aluno/avaliacoes', texto: 'Minhas avaliações' },
      { para: '/aluno/certificados', texto: 'Meus certificados' },
    ],
  },
  {
    titulo: 'Assinatura',
    itens: [
      { para: '/aluno/planos', texto: 'Planos' },
      { para: '/aluno/assinaturas', texto: 'Minhas assinaturas' },
      { para: '/aluno/pagamentos', texto: 'Meus pagamentos' },
    ],
  },
];

const MENU_PROFESSOR: Secao[] = [
  {
    titulo: 'Catálogo',
    itens: [
      { para: '/professor/cursos', texto: 'Cursos' },
      { para: '/professor/categorias', texto: 'Categorias' },
      { para: '/professor/trilhas', texto: 'Trilhas' },
    ],
  },
  {
    titulo: 'Conteúdo',
    itens: [
      { para: '/professor/modulos', texto: 'Módulos' },
      { para: '/professor/aulas', texto: 'Aulas' },
    ],
  },
  {
    titulo: 'Alunos',
    itens: [
      { para: '/professor/matriculas', texto: 'Matrículas' },
      { para: '/professor/progresso-aulas', texto: 'Progresso' },
      { para: '/professor/avaliacoes', texto: 'Avaliações' },
      { para: '/professor/certificados', texto: 'Certificados' },
    ],
  },
];

// Fecha o menu suspenso (<details>) depois de clicar num item.
function fecharMenu(e: MouseEvent<HTMLElement>) {
  e.currentTarget.closest('details')?.removeAttribute('open');
}

// Layout da área do aluno e da área do professor: barra no topo + conteúdo.
export default function LayoutPlataforma({ perfil }: { perfil: 'USER' | 'INSTRUTOR' }) {
  const { token, perfil: meuPerfil, logout } = useAuth();
  const { dados: eu } = useApi<Usuario>(token ? '/usuarios/me' : null);

  if (!token) return <Navigate to="/login" replace />;
  // Cada um na sua área: quem abrir a área errada é levado para a dele.
  if (meuPerfil !== perfil) return <Navigate to={inicioDoPerfil(meuPerfil)} replace />;

  const base = inicioDoPerfil(perfil);
  const menu = perfil === 'USER' ? MENU_ALUNO : MENU_PROFESSOR;

  return (
    <div className="plataforma">
      <header className="topo">
        <div className="topo-conteudo">
          <Link to={base} className="marca">
            Cursos Online
          </Link>

          <nav className="topo-menu">
            <NavLink to={base} end>
              Início
            </NavLink>
            {menu.map((secao) => (
              <details key={secao.titulo} className="menu">
                <summary>{secao.titulo}</summary>
                <div className="menu-itens">
                  {secao.itens.map((item) => (
                    <NavLink key={item.para} to={item.para} onClick={fecharMenu}>
                      {item.texto}
                    </NavLink>
                  ))}
                </div>
              </details>
            ))}
          </nav>

          <div className="topo-usuario">
            <Link to={`${base}/perfil`} className="avatar" title="Meu perfil">
              {iniciais(eu?.nomeCompleto)}
            </Link>
            <span>
              <strong>{eu?.nomeCompleto ?? '…'}</strong>
              <small>{perfil === 'USER' ? 'Aluno' : 'Professor'}</small>
            </span>
            <button className="secundario" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
