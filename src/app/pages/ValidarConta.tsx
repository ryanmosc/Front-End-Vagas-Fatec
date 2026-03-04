import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { ValidacaoContaDTO } from '../types';
import { toast } from 'sonner';

const ValidarConta: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ValidacaoContaDTO>({
    emailCandidato: '',
    codigo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/candidatos/validar', formData);
      toast.success('Conta validada com sucesso! Você já pode fazer login.');
      navigate('/login');
    } catch (error: any) {
      setError(error.message || 'Erro ao validar conta');
      toast.error(error.message || 'Erro ao validar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Validar Conta
            </h2>
            <p className="text-gray-600 mt-2">
              Digite o código de 6 dígitos enviado para seu e-mail
            </p>
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
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="emailCandidato"
                  value={formData.emailCandidato}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Validação
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
              />
              <p className="mt-2 text-xs text-gray-500">
                Digite o código de 6 dígitos recebido por e-mail
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validando...' : 'Validar Conta'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Não recebeu o código?{' '}
              <button
                onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Reenviar código
              </button>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidarConta;
