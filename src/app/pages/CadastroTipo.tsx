import React from 'react';
import { Link } from 'react-router';
import { User, Building2 } from 'lucide-react';

const CadastroTipo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como você deseja se cadastrar?
          </h2>
          <p className="text-xl text-gray-600">
            Escolha o tipo de conta que melhor se adequa a você
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Candidato/Aluno */}
          <Link
            to="/cadastro/candidato"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors">
                <User className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sou Aluno
              </h3>
              <p className="text-gray-600 mb-6">
                Cadastre-se como candidato para buscar vagas e oportunidades
                de estágio e emprego
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Acesso a todas as vagas disponíveis</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Candidatar-se com um clique</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span>Acompanhar status das candidaturas</span>
                </div>
              </div>
              <div className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg inline-block group-hover:bg-blue-700 transition-colors">
                Cadastrar como Aluno
              </div>
            </div>
          </Link>

          {/* Empresa */}
          <Link
            to="/cadastro/empresa"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 group-hover:bg-green-600 transition-colors">
                <Building2 className="h-10 w-10 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sou Empresa
              </h3>
              <p className="text-gray-600 mb-6">
                Cadastre sua empresa para publicar vagas e encontrar talentos
                da Fatec
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Publicar vagas ilimitadas</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Gerenciar candidatos</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span>Acesso a currículos qualificados</span>
                </div>
              </div>
              <div className="mt-6 bg-green-600 text-white py-3 px-6 rounded-lg inline-block group-hover:bg-green-700 transition-colors">
                Cadastrar como Empresa
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroTipo;
