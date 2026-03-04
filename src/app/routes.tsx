import { createBrowserRouter } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroTipo from './pages/CadastroTipo';
import CadastroCandidato from './pages/CadastroCandidato';
import CadastroEmpresa from './pages/CadastroEmpresa';
import ValidarConta from './pages/ValidarConta';
import VagaDetalhes from './pages/VagaDetalhes';

// Candidato pages
import CandidatoDashboard from './pages/candidato/CandidatoDashboard';
import CandidatoPerfil from './pages/candidato/CandidatoPerfil';

// Empresa pages
import EmpresaDashboard from './pages/empresa/EmpresaDashboard';
import VagaCriar from './pages/empresa/VagaCriar';
import VagaCandidatos from './pages/empresa/VagaCandidatos';
import VagaEditar from './pages/empresa/VagaEditar';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'cadastro/tipo',
        Component: CadastroTipo,
      },
      {
        path: 'cadastro/candidato',
        Component: CadastroCandidato,
      },
      {
        path: 'cadastro/empresa',
        Component: CadastroEmpresa,
      },
      {
        path: 'validar-conta',
        Component: ValidarConta,
      },
      {
        path: 'vaga/:vagaId',
        Component: VagaDetalhes,
      },
      // Candidato Routes
      {
        path: 'candidato/dashboard',
        element: (
          <ProtectedRoute allowedRole={UserRole.CANDIDATO}>
            <CandidatoDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'candidato/perfil',
        element: (
          <ProtectedRoute allowedRole={UserRole.CANDIDATO}>
            <CandidatoPerfil />
          </ProtectedRoute>
        ),
      },
      // Empresa Routes
      {
        path: 'empresa/dashboard',
        element: (
          <ProtectedRoute allowedRole={UserRole.EMPRESA}>
            <EmpresaDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'empresa/vaga/criar',
        element: (
          <ProtectedRoute allowedRole={UserRole.EMPRESA}>
            <VagaCriar />
          </ProtectedRoute>
        ),
      },
      {
        path: 'empresa/vaga/:vagaId/candidatos',
        element: (
          <ProtectedRoute allowedRole={UserRole.EMPRESA}>
            <VagaCandidatos />
          </ProtectedRoute>
        ),
      },
      {
        path: 'empresa/vaga/:vagaId/editar',
        element: (
          <ProtectedRoute allowedRole={UserRole.EMPRESA}>
            <VagaEditar />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);