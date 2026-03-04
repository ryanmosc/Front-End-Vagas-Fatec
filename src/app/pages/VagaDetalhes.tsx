import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';
import { VagaResponseDTO, Curso, Modalidade, TipoVaga, UserRole } from '../types';
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

const VagaDetalhes: React.FC = () => {
  const { vagaId } = useParams<{ vagaId: string }>();
  const { user } = useAuth();
  const [vaga, setVaga] = useState<VagaResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(false);

  useEffect(() => {
    if (vagaId) {
      loadVaga();
    }
  }, [vagaId]);

  const loadVaga = async () => {
    try {
      const data = await api.get<VagaResponseDTO>(`/vagas/${vagaId}`);
      setVaga(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar vaga');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidatar = async () => {
    if (!vagaId) return;

    setCandidatando(true);
    try {
      await api.post(`/candidaturas/vaga/${vagaId}`, {}, true);
      toast.success('Candidatura enviada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar candidatura');
    } finally {
      setCandidatando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vaga não encontrada</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Voltar para vagas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para vagas
          </Link>

          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vaga.titulo}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span className="text-lg">{vaga.empresaNome}</span>
                  </div>
                </div>
                {vaga.encerrada ? (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
                    Vaga Encerrada
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                    Vaga Aberta
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {cursoLabels[vaga.cursoVaga]}
                </span>
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  {tipoVagaLabels[vaga.tipoVaga]}
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {modalidadeLabels[vaga.modalidade]}
                </span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-sm">Localização</span>
                </div>
                <p className="text-lg font-medium text-gray-900">{vaga.cidade}</p>
              </div>

              {vaga.bolsaAuxilio && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="text-sm">Bolsa Auxílio</span>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    R${' '}
                    {vaga.bolsaAuxilio.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="text-sm">Data de Encerramento</span>
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(vaga.dataEncerramento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sobre a Vaga
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {vaga.descricao}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            {user?.role === UserRole.CANDIDATO && !vaga.encerrada && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleCandidatar}
                  disabled={candidatando}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {candidatando ? 'Enviando...' : 'Candidatar-se para esta vaga'}
                </button>
              </div>
            )}

            {!user && !vaga.encerrada && (
              <div className="pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-900 mb-4">
                    Faça login para se candidatar a esta vaga
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Fazer Login
                  </Link>
                </div>
              </div>
            )}

            {vaga.encerrada && (
              <div className="pt-6 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-900">
                    Esta vaga está encerrada e não aceita mais candidaturas
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VagaDetalhes;
