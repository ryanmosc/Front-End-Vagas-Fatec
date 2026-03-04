import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router';
import { api } from '../services/api';
import { VagaResponseDTO, Curso, Modalidade, TipoVaga } from '../types';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const cursoLabels: Record<Curso, string> = {
  [Curso.ADS]: 'ADS - Análise e Desenvolvimento de Sistemas',
  [Curso.GRH]: 'GRH - Gestão de Recursos Humanos',
  [Curso.GPI]: 'GPI - Gestão da Produção Industrial',
  [Curso.DSM]: 'DSM - Desenvolvimento de Software Multiplataforma',
};

const modalidadeLabels: Record<Modalidade, string> = {
  [Modalidade.PRESENCIAL]: 'Presencial',
  [Modalidade.REMOTO]: 'Remoto',
  [Modalidade.HIBRIDO]: 'Híbrido',
};

const tipoVagaLabels: Record<TipoVaga, string> = {
  [TipoVaga.ESTAGIO]: 'Estágio',
  [TipoVaga.CLT]: 'CLT',
  [TipoVaga.PJ]: 'PJ',
};

const Home: React.FC = () => {
  const { user } = useAuth();
  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [filteredVagas, setFilteredVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursoFilter, setCursoFilter] = useState<string>('TODOS');
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVagas();
  }, []);

  useEffect(() => {
    filterVagas();
  }, [cursoFilter, modalidadeFilter, searchTerm, vagas]);

  const loadVagas = async () => {
    try {
      const data = await api.get<VagaResponseDTO[]>('/vagas');
      // Filtrar apenas vagas abertas
      const vagasAbertas = data.filter((vaga) => !vaga.encerrada);
      setVagas(vagasAbertas);
      setFilteredVagas(vagasAbertas);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const filterVagas = () => {
    let filtered = [...vagas];

    if (cursoFilter !== 'TODOS') {
      filtered = filtered.filter((vaga) => vaga.cursoVaga === cursoFilter);
    }

    if (modalidadeFilter !== 'TODOS') {
      filtered = filtered.filter((vaga) => vaga.modalidade === modalidadeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vaga) =>
          vaga.titulo.toLowerCase().includes(term) ||
          vaga.empresaNome.toLowerCase().includes(term) ||
          vaga.cidade.toLowerCase().includes(term)
      );
    }

    setFilteredVagas(filtered);
  };

  const handleCandidatar = async (vagaId: number) => {
    try {
      await api.post(`/candidaturas/vaga/${vagaId}`, {}, true);
      toast.success('Candidatura enviada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar candidatura');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Encontre as melhores oportunidades
          </h1>
          <p className="text-xl text-blue-100">
            Vagas exclusivas para alunos da Fatec
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, empresa ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Curso Filter */}
            <select
              value={cursoFilter}
              onChange={(e) => setCursoFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todos os Cursos</option>
              {Object.entries(cursoLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Modalidade Filter */}
            <select
              value={modalidadeFilter}
              onChange={(e) => setModalidadeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todas as Modalidades</option>
              {Object.entries(modalidadeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vagas List */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredVagas.length} {filteredVagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </h2>
        </div>

        {filteredVagas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma vaga encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para ver mais resultados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVagas.map((vaga) => (
              <div
                key={vaga.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {vaga.titulo}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="h-4 w-4 mr-1" />
                      {vaga.empresaNome}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{vaga.cidade}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {tipoVagaLabels[vaga.tipoVaga]} • {modalidadeLabels[vaga.modalidade]}
                    </span>
                  </div>

                  {vaga.bolsaAuxilio && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        R$ {vaga.bolsaAuxilio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      Encerra em {new Date(vaga.dataEncerramento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {cursoLabels[vaga.cursoVaga]}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/vaga/${vaga.id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver Detalhes
                  </Link>
                  {user?.role === 'CANDIDATO' && (
                    <button
                      onClick={() => handleCandidatar(vaga.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Candidatar-se
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
