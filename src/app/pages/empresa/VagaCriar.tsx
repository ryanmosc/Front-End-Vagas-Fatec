import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { VagaCreateDTO, Curso, Modalidade, TipoVaga } from '../../types';
import { toast } from 'sonner';

const VagaCriar: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<VagaCreateDTO>({
    titulo: '',
    descricao: '',
    cursoVaga: Curso.ADS,
    tipoVaga: TipoVaga.ESTAGIO,
    modalidade: Modalidade.PRESENCIAL,
    cidade: '',
    bolsaAuxilio: undefined,
    dataEncerramento: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'bolsaAuxilio' ? (value ? parseFloat(value) : undefined) : value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/vagas', formData, true);
      toast.success('Vaga criada com sucesso!');
      navigate('/empresa/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar vaga');
      toast.error(error.message || 'Erro ao criar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-green-600 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Criar Nova Vaga
                </h1>
                <p className="text-gray-600">
                  Preencha os detalhes da vaga
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Vaga *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Desenvolvedor Full Stack Júnior"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso *
                  </label>
                  <select
                    name="cursoVaga"
                    value={formData.cursoVaga}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={Curso.ADS}>ADS - Análise e Desenvolvimento</option>
                    <option value={Curso.GRH}>GRH - Gestão de RH</option>
                    <option value={Curso.GPI}>GPI - Gestão da Produção</option>
                    <option value={Curso.DSM}>DSM - Desenvolvimento Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vaga *
                  </label>
                  <select
                    name="tipoVaga"
                    value={formData.tipoVaga}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={TipoVaga.ESTAGIO}>Estágio</option>
                    <option value={TipoVaga.CLT}>CLT</option>
                    <option value={TipoVaga.PJ}>PJ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modalidade *
                  </label>
                  <select
                    name="modalidade"
                    value={formData.modalidade}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={Modalidade.PRESENCIAL}>Presencial</option>
                    <option value={Modalidade.REMOTO}>Remoto</option>
                    <option value={Modalidade.HIBRIDO}>Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: São Paulo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bolsa Auxílio
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="bolsaAuxilio"
                      value={formData.bolsaAuxilio || ''}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Encerramento *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="dataEncerramento"
                      value={formData.dataEncerramento}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Criando...' : 'Criar Vaga'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/empresa/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VagaCriar;
