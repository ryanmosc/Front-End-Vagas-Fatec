import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Calendar,
  Upload,
  FileText,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  CandidatoResponseDTO,
  CandidatoAtualizarPerfilDTO,
} from '../../types';
import { toast } from 'sonner';

const CandidatoPerfil: React.FC = () => {
  const [candidato, setCandidato] = useState<CandidatoResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingCurriculo, setUploadingCurriculo] = useState(false);
  const [formData, setFormData] = useState<CandidatoAtualizarPerfilDTO>({
    telefone: '',
    cidade: '',
    linkedin: '',
    github: '',
    bio: '',
    dataNascimento: '',
  });

  useEffect(() => {
    loadPerfil();
  }, []);

  const loadPerfil = async () => {
    try {
      const data = await api.get<CandidatoResponseDTO>('/candidatos/perfil', true);
      setCandidato(data);
      setFormData({
        telefone: data.telefone || '',
        cidade: data.cidade || '',
        linkedin: data.linkedin || '',
        github: data.github || '',
        bio: data.bio || '',
        dataNascimento: data.dataNascimento || '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updated = await api.patch<CandidatoResponseDTO>(
        '/candidatos/perfil',
        formData,
        true
      );
      setCandidato(updated);
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    }
  };

  const handleCurriculoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 5MB');
      return;
    }

    setUploadingCurriculo(true);

    try {
      await api.uploadFile('/candidatos/perfil/curriculo', file, 'curriculo');
      toast.success('Currículo enviado com sucesso!');
      loadPerfil();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar currículo');
    } finally {
      setUploadingCurriculo(false);
    }
  };

  const handleVisualizarCurriculo = async () => {
    try {
      const blob = await api.downloadFile('/candidatos/perfil/curriculo/visualizar');
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao visualizar currículo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {candidato.nomeCompleto}
                </h1>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {candidato.emailCandidato}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    RA: {candidato.raAluno}
                  </div>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>

            {candidato.bio && !editing && (
              <p className="text-gray-700 mt-4 p-4 bg-gray-50 rounded-lg">
                {candidato.bio}
              </p>
            )}
          </div>

          {/* Form Edit or Info Display */}
          {editing ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sua cidade"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="linkedin.com/in/seu-perfil"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="github.com/seu-usuario"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      telefone: candidato.telefone || '',
                      cidade: candidato.cidade || '',
                      linkedin: candidato.linkedin || '',
                      github: candidato.github || '',
                      bio: candidato.bio || '',
                      dataNascimento: candidato.dataNascimento || '',
                    });
                  }}
                  className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações de Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidato.telefone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="text-gray-900">{candidato.telefone}</p>
                    </div>
                  </div>
                )}

                {candidato.cidade && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Cidade</p>
                      <p className="text-gray-900">{candidato.cidade}</p>
                    </div>
                  </div>
                )}

                {candidato.linkedin && (
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">LinkedIn</p>
                      <a
                        href={candidato.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver perfil
                      </a>
                    </div>
                  </div>
                )}

                {candidato.github && (
                  <div className="flex items-center space-x-3">
                    <Github className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">GitHub</p>
                      <a
                        href={candidato.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver perfil
                      </a>
                    </div>
                  </div>
                )}

                {candidato.dataNascimento && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Data de Nascimento</p>
                      <p className="text-gray-900">
                        {new Date(candidato.dataNascimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Currículo Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Currículo
            </h2>

            {candidato.caminhoCurriculo ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">
                      Currículo enviado
                    </p>
                    <p className="text-sm text-green-700">
                      Seu currículo está disponível para as empresas
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleVisualizarCurriculo}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Visualizar
                </button>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 mb-4">
                  Você ainda não enviou seu currículo. Envie agora para aumentar
                  suas chances!
                </p>
              </div>
            )}

            <div className="mt-4">
              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCurriculoUpload}
                  disabled={uploadingCurriculo}
                  className="hidden"
                  id="curriculo-upload"
                />
                <label
                  htmlFor="curriculo-upload"
                  className={`flex items-center justify-center space-x-2 w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                    uploadingCurriculo ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  <span>
                    {uploadingCurriculo
                      ? 'Enviando...'
                      : candidato.caminhoCurriculo
                      ? 'Atualizar Currículo'
                      : 'Enviar Currículo'}
                  </span>
                </label>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formato: PDF • Tamanho máximo: 5MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatoPerfil;
