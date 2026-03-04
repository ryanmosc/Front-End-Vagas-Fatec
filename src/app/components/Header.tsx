import React from 'react';
import { Link } from 'react-router';
import { Briefcase, LogOut, User, Building2, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">
              Vagas Fatec
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Vagas
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro/tipo"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            ) : (
              <>
                {user?.role === UserRole.CANDIDATO && (
                  <>
                    <Link
                      to="/candidato/dashboard"
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Minhas Candidaturas</span>
                    </Link>
                    <Link
                      to="/candidato/perfil"
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </>
                )}

                {user?.role === UserRole.EMPRESA && (
                  <Link
                    to="/empresa/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Meu Painel</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};