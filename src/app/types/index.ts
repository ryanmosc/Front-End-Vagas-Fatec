// Tipos e interfaces da aplicação

export enum UserRole {
  CANDIDATO = 'CANDIDATO',
  EMPRESA = 'EMPRESA',
}

export enum StatusCandidatura {
  ENVIADO = 'ENVIADO',
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
  DESISTIU = 'DESISTIU',
}

export enum Curso {
  ADS = 'ADS',
  GRH = 'GRH',
  GPI = 'GPI',
  DSM = 'DSM',
}

export enum Modalidade {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  HIBRIDO = 'HIBRIDO',
}

export enum TipoVaga {
  ESTAGIO = 'ESTAGIO',
  CLT = 'CLT',
  PJ = 'PJ',
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  nome?: string;
  razaoSocial?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface CandidatoCadastroDTO {
  nomeCompleto: string;
  raAluno: string;
  emailCandidato: string;
  senha: string;
}

export interface EmpresaCadastroDTO {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  senha: string;
}

export interface CandidatoResponseDTO {
  id: number;
  nomeCompleto: string;
  raAluno: string;
  emailCandidato: string;
  telefone?: string;
  cidade?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  dataNascimento?: string;
  caminhoCurriculo?: string;
}

export interface CandidatoAtualizarPerfilDTO {
  telefone?: string;
  cidade?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  dataNascimento?: string;
}

export interface VagaResponseDTO {
  id: number;
  titulo: string;
  descricao: string;
  cursoVaga: Curso;
  tipoVaga: TipoVaga;
  modalidade: Modalidade;
  cidade: string;
  bolsaAuxilio?: number;
  dataEncerramento: string;
  empresaId: number;
  empresaNome: string;
  encerrada: boolean;
}

export interface VagaCreateDTO {
  titulo: string;
  descricao: string;
  cursoVaga: Curso;
  tipoVaga: TipoVaga;
  modalidade: Modalidade;
  cidade: string;
  bolsaAuxilio?: number;
  dataEncerramento: string;
}

export interface CandidaturaResponseDTO {
  id: number;
  vagaId: number;
  vagaTitulo: string;
  empresaNome: string;
  candidatoId: number;
  candidatoNome: string;
  status: StatusCandidatura;
  dataCandidatura: string;
  observacaoInterna?: string;
}

export interface CandidaturaObservacaoDTO {
  observacaoInterna: string;
}

export interface ValidacaoContaDTO {
  emailCandidato: string;
  codigo: string;
}
