import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth';
import Layout from './Layout';
import { recursosProfessor } from './resources';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Login from './pages/Login';
import ResourcePage from './pages/ResourcePage';
import LayoutPlataforma from './pages/plataforma/LayoutPlataforma';
import Perfil from './pages/plataforma/Perfil';
import InicioAluno from './pages/aluno/Inicio';
import Cursos from './pages/aluno/Cursos';
import CursoDetalhe from './pages/aluno/CursoDetalhe';
import Trilhas from './pages/aluno/Trilhas';
import TrilhaDetalhe from './pages/aluno/TrilhaDetalhe';
import Matriculas from './pages/aluno/Matriculas';
import Progresso from './pages/aluno/Progresso';
import Avaliacoes from './pages/aluno/Avaliacoes';
import Certificados from './pages/aluno/Certificados';
import CertificadoDetalhe from './pages/aluno/CertificadoDetalhe';
import Planos from './pages/aluno/Planos';
import Assinaturas from './pages/aluno/Assinaturas';
import Pagamentos from './pages/aluno/Pagamentos';
import InicioProfessor from './pages/professor/Inicio';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Painel do admin (perfil ADMIN): menu lateral + tabelas */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/:slug" element={<ResourcePage />} />
          </Route>

          {/* Área do aluno (perfil USER) */}
          <Route path="/aluno" element={<LayoutPlataforma perfil="USER" />}>
            <Route index element={<InicioAluno />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="cursos/:id" element={<CursoDetalhe />} />
            <Route path="trilhas" element={<Trilhas />} />
            <Route path="trilhas/:id" element={<TrilhaDetalhe />} />
            <Route path="matriculas" element={<Matriculas />} />
            <Route path="progresso" element={<Progresso />} />
            <Route path="avaliacoes" element={<Avaliacoes />} />
            <Route path="certificados" element={<Certificados />} />
            <Route path="certificados/:id" element={<CertificadoDetalhe />} />
            <Route path="planos" element={<Planos />} />
            <Route path="assinaturas" element={<Assinaturas />} />
            <Route path="pagamentos" element={<Pagamentos />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>

          {/* Área do professor (perfil INSTRUTOR): painel + as mesmas tabelas do admin, só as dele */}
          <Route path="/professor" element={<LayoutPlataforma perfil="INSTRUTOR" />}>
            <Route index element={<InicioProfessor />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path=":slug" element={<ResourcePage lista={recursosProfessor} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
