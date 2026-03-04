import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Users, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { api } from '../../services/api';
import { VagaResponseDTO } from '../../types';
import { toast } from 'sonner';

const EmpresaDashboard: React.FC = () => {
  const [vagas, setVagas] = useState<VagaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVagas();
  }, []);

  const loadVagas = async () => {
    try {
      const data = await api.get<VagaResponseDTO[]>('/vagas/minhas', true);
      setVagas(data);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const handleEncerrar = async (vagaId: number) => {
    if (!confirm('Tem certeza que deseja encerrar esta vaga?')) {
      return;
    }

    try {
      await api.patch(`/vagas/${vagaId}/encerrar`, {}, true);
      toast.success('Vaga encerrada com sucesso');
      loadVagas();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao encerrar vaga');
    }
  };

  const handleReabrir = async (vagaId: number) => {
    try {
      await api.patch(`/vagas/${vagaId}/reabrir`, {}, true);
      toast.success('Vaga reaberta com sucesso');
      loadVagas();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao reabrir vaga');
    }
  };

  const handleDeletar = async (vagaId: number) => {
    if (!confirm('Tem certeza que deseja deletar esta vaga? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.delete(`/vagas/${vagaId}`, true);
      toast.success('Vaga deletada com sucesso');
      loadVagas();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar vaga');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Minhas Vagas
            </h1>
            <p className="text-gray-600">
              Gerencie suas vagas e candidatos
            </p>
          </div>
          <Link
            to="/empresa/vaga/criar"
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Vaga</span>
          </Link>
        </div>

        {vagas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma vaga cadastrada
            </h3>
            <p className="text-gray-600 mb-6">
              Crie sua primeira vaga e comece a receber candidaturas
            </p>
            <Link
              to="/empresa/vaga/criar"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Vaga</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {vaga.titulo}
                      </h3>
                      {vaga.encerrada ? (
                        <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                          Encerrada
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                          Aberta
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{vaga.descricao}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Curso</p>
                    <p className="text-sm font-medium text-gray-900">
                      {vaga.cursoVaga}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="text-sm font-medium text-gray-900">
                      {vaga.tipoVaga}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Modalidade</p>
                    <p className="text-sm font-medium text-gray-900">
                      {vaga.modalidade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cidade</p>
                    <p className="text-sm font-medium text-gray-900">
                      {vaga.cidade}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                  <Link
                    to={`/empresa/vaga/${vaga.id}/candidatos`}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>Ver Candidatos</span>
                  </Link>

                  <Link
                    to={`/vaga/${vaga.id}`}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Visualizar</span>
                  </Link>

                  <Link
                    to={`/empresa/vaga/${vaga.id}/editar`}
                    className="flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </Link>

                  {vaga.encerrada ? (
                    <button
                      onClick={() => handleReabrir(vaga.id)}
                      className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Reabrir</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEncerrar(vaga.id)}
                      className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Encerrar</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeletar(vaga.id)}
                    className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Deletar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpresaDashboard;
