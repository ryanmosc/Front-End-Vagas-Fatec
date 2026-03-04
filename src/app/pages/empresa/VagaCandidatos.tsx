import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  User,
  Mail,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  CandidaturaResponseDTO,
  StatusCandidatura,
  CandidaturaObservacaoDTO,
} from '../../types';
import { toast } from 'sonner';

const statusLabels: Record<StatusCandidatura, string> = {
  [StatusCandidatura.ENVIADO]: 'Enviado',
  [StatusCandidatura.EM_ANALISE]: 'Em Análise',
  [StatusCandidatura.APROVADO]: 'Aprovado',
  [StatusCandidatura.REJEITADO]: 'Rejeitado',
  [StatusCandidatura.DESISTIU]: 'Desistiu',
};

const VagaCandidatos: React.FC = () => {
  const { vagaId } = useParams<{ vagaId: string }>();
  const [candidaturas, setCandidaturas] = useState<CandidaturaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingObservacao, setEditingObservacao] = useState<number | null>(null);
  const [observacoes, setObservacoes] = useState<Record<number, string>>({});

  useEffect(() => {
    if (vagaId) {
      loadCandidaturas();
    }
  }, [vagaId]);

  const loadCandidaturas = async () => {
    try {
      const data = await api.get<CandidaturaResponseDTO[]>(
        `/candidaturas/empresa/vaga/${vagaId}/candidaturas_vaga`,
        true
      );
      setCandidaturas(data);

      // Inicializar observações
      const obs: Record<number, string> = {};
      data.forEach((cand) => {
        obs[cand.id] = cand.observacaoInterna || '';
      });
      setObservacoes(obs);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar candidatos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    candidaturaId: number,
    newStatus: StatusCandidatura
  ) => {
    try {
      await api.patch(
        `/candidaturas/empresa/candidatura/${candidaturaId}/novo_status?status=${newStatus}`,
        {},
        true
      );
      toast.success('Status atualizado com sucesso');
      loadCandidaturas();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar status');
    }
  };

  const handleSaveObservacao = async (candidaturaId: number) => {
    const observacao = observacoes[candidaturaId];

    if (!observacao || observacao.length === 0) {
      toast.error('Digite uma observação');
      return;
    }

    if (observacao.length > 150) {
      toast.error('A observação deve ter no máximo 150 caracteres');
      return;
    }

    try {
      const dto: CandidaturaObservacaoDTO = { observacaoInterna: observacao };
      await api.patch(
        `/candidaturas/empresa/candidatura/${candidaturaId}/observacoes`,
        dto,
        true
      );
      toast.success('Observação salva com sucesso');
      setEditingObservacao(null);
      loadCandidaturas();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar observação');
    }
  };

  const handleVisualizarCurriculo = async (candidaturaId: number) => {
    try {
      const blob = await api.downloadFile(
        `/candidatos/perfil/curriculo/visualizar/${candidaturaId}/candidatura`
      );
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao visualizar currículo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const vagaTitulo = candidaturas[0]?.vagaTitulo || 'Vaga';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/empresa/dashboard"
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Minhas Vagas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidatos - {vagaTitulo}
          </h1>
          <p className="text-gray-600">
            {candidaturas.length} {candidaturas.length === 1 ? 'candidato' : 'candidatos'}
          </p>
        </div>

        {candidaturas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum candidato ainda
            </h3>
            <p className="text-gray-600">
              Aguarde as candidaturas chegarem
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {candidaturas.map((candidatura) => (
              <div
                key={candidatura.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {candidatura.candidatoNome}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Candidatura enviada em{' '}
                        {new Date(candidatura.dataCandidatura).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVisualizarCurriculo(candidatura.id)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Ver Currículo</span>
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status da Candidatura
                  </label>
                  <div className="flex items-center space-x-3">
                    <select
                      value={candidatura.status}
                      onChange={(e) =>
                        handleStatusChange(
                          candidatura.id,
                          e.target.value as StatusCandidatura
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          candidatura.id,
                          StatusCandidatura.APROVADO
                        )
                      }
                      className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Aprovar</span>
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          candidatura.id,
                          StatusCandidatura.REJEITADO
                        )
                      }
                      className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Rejeitar</span>
                    </button>
                  </div>
                </div>

                {/* Observação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observação Interna (máx. 150 caracteres)
                  </label>
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={observacoes[candidatura.id] || ''}
                        onChange={(e) =>
                          setObservacoes({
                            ...observacoes,
                            [candidatura.id]: e.target.value,
                          })
                        }
                        onFocus={() => setEditingObservacao(candidatura.id)}
                        maxLength={150}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Adicione observações sobre este candidato..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {(observacoes[candidatura.id] || '').length}/150 caracteres
                      </p>
                    </div>
                    {editingObservacao === candidatura.id && (
                      <button
                        onClick={() => handleSaveObservacao(candidatura.id)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Salvar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VagaCandidatos;
