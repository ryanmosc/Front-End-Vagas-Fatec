import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, UserX, Eye } from 'lucide-react';
import { api } from '../services/api';
import { CandidaturaResponseDTO, StatusCandidatura } from '../types';
import { toast } from 'sonner';
import { Link } from 'react-router';

const statusLabels: Record<StatusCandidatura, string> = {
  [StatusCandidatura.ENVIADO]: 'Enviado',
  [StatusCandidatura.EM_ANALISE]: 'Em Análise',
  [StatusCandidatura.APROVADO]: 'Aprovado',
  [StatusCandidatura.REJEITADO]: 'Rejeitado',
  [StatusCandidatura.DESISTIU]: 'Desistiu',
};

const statusColors: Record<StatusCandidatura, string> = {
  [StatusCandidatura.ENVIADO]: 'bg-blue-100 text-blue-800',
  [StatusCandidatura.EM_ANALISE]: 'bg-yellow-100 text-yellow-800',
  [StatusCandidatura.APROVADO]: 'bg-green-100 text-green-800',
  [StatusCandidatura.REJEITADO]: 'bg-red-100 text-red-800',
  [StatusCandidatura.DESISTIU]: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<StatusCandidatura, React.ReactNode> = {
  [StatusCandidatura.ENVIADO]: <Clock className="h-5 w-5" />,
  [StatusCandidatura.EM_ANALISE]: <Eye className="h-5 w-5" />,
  [StatusCandidatura.APROVADO]: <CheckCircle className="h-5 w-5" />,
  [StatusCandidatura.REJEITADO]: <XCircle className="h-5 w-5" />,
  [StatusCandidatura.DESISTIU]: <UserX className="h-5 w-5" />,
};

const CandidatoDashboard: React.FC = () => {
  const [candidaturas, setCandidaturas] = useState<CandidaturaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidaturas();
  }, []);

  const loadCandidaturas = async () => {
    try {
      const data = await api.get<CandidaturaResponseDTO[]>('/candidaturas/minhas', true);
      setCandidaturas(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  };

  const handleDesistir = async (vagaId: number) => {
    if (!confirm('Tem certeza que deseja desistir desta vaga?')) {
      return;
    }

    try {
      await api.patch(`/candidaturas/vaga/${vagaId}/desistir`, {}, true);
      toast.success('Desistência registrada com sucesso');
      loadCandidaturas();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao desistir da vaga');
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Minhas Candidaturas
          </h1>
          <p className="text-gray-600">
            Acompanhe o status das suas candidaturas
          </p>
        </div>

        {candidaturas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma candidatura ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Explore as vagas disponíveis e candidate-se às oportunidades
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Vagas Disponíveis
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {candidaturas.map((candidatura) => (
              <div
                key={candidatura.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {candidatura.vagaTitulo}
                    </h3>
                    <p className="text-gray-600">
                      {candidatura.empresaNome}
                    </p>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                      statusColors[candidatura.status]
                    }`}
                  >
                    {statusIcons[candidatura.status]}
                    <span className="font-medium">
                      {statusLabels[candidatura.status]}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Candidatura enviada em{' '}
                    {new Date(candidatura.dataCandidatura).toLocaleDateString('pt-BR')}
                  </div>
                  
                  {candidatura.observacaoInterna && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Observação da Empresa:
                      </p>
                      <p className="text-sm text-blue-800">
                        {candidatura.observacaoInterna}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex gap-3">
                  <Link
                    to={`/vaga/${candidatura.vagaId}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver Vaga
                  </Link>
                  
                  {candidatura.status !== StatusCandidatura.DESISTIU &&
                    candidatura.status !== StatusCandidatura.REJEITADO && (
                      <button
                        onClick={() => handleDesistir(candidatura.vagaId)}
                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Desistir
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

export default CandidatoDashboard;
