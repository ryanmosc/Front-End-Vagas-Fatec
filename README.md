# Vagas Fatec - Plataforma de Gestão de Vagas

Plataforma completa de gestão de vagas desenvolvida para conectar alunos da Fatec com oportunidades de estágio e emprego.

## 🚀 Tecnologias

### Frontend
- React 18.3.1
- TypeScript
- React Router 7
- Tailwind CSS 4
- Lucide React (ícones)
- Sonner (notificações toast)
- JWT Decode

### Backend (Spring Boot)
- Spring Boot
- Spring Security com JWT
- PostgreSQL/MySQL
- Validação de dados
- Upload de arquivos (currículo)

## 📋 Funcionalidades

### Área Pública
- ✅ Vitrine de vagas com filtros por curso e modalidade
- ✅ Busca de vagas por título, empresa ou cidade
- ✅ Visualização detalhada de vagas
- ✅ Login e cadastro separado para Aluno e Empresa
- ✅ Validação de conta por código de 6 dígitos (e-mail)

### Painel do Candidato (Aluno)
- ✅ Dashboard com todas as candidaturas
- ✅ Visualização de status das candidaturas
- ✅ Perfil completo editável (telefone, cidade, LinkedIn, GitHub, bio)
- ✅ Upload de currículo (PDF, máx 5MB)
- ✅ Desistência de candidaturas
- ✅ Candidatura rápida com um clique

### Painel da Empresa
- ✅ Dashboard com todas as vagas publicadas
- ✅ Criação, edição e exclusão de vagas
- ✅ Encerramento e reabertura de vagas
- ✅ Gestão de candidatos por vaga
- ✅ Visualização de currículos dos candidatos
- ✅ Alteração de status das candidaturas
- ✅ Observações internas por candidato (máx 150 caracteres)

## ⚙️ Configuração

### 1. Configurar URL da API

Edite o arquivo `/src/app/services/api.ts` e altere a URL base da API:

```typescript
const API_BASE_URL = 'http://localhost:8080/api'; // Altere para a URL do seu backend
```

### 2. Instalar Dependências

```bash
npm install
# ou
pnpm install
```

### 3. Executar o Projeto

```bash
npm run dev
# ou
pnpm dev
```

## 🔐 Autenticação e Segurança

### JWT Token
O sistema utiliza JWT para autenticação stateless. Após o login:
- O token é armazenado no `localStorage`
- Todas as requisições privadas incluem o header: `Authorization: Bearer <token>`
- O token contém as informações: `id`, `email` e `role` (CANDIDATO ou EMPRESA)

### Fluxo de Autenticação
1. **Login**: POST `/api/auth/login` → retorna token JWT
2. **Decodificação**: Frontend decodifica o token para obter role
3. **Redirecionamento**: Usuário é redirecionado para o dashboard correto
4. **Proteção de Rotas**: ProtectedRoute verifica autenticação e role

### Tratamento de Erros
- **401/403**: Token inválido → Logout automático e redirecionamento para login
- **400/422**: Erros de validação → Toast com mensagem do backend
- **500**: Erro interno → Toast com mensagem genérica

## 📂 Estrutura do Projeto

```
src/app/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # Contextos React
│   └── AuthContext.tsx
├── layouts/             # Layouts da aplicação
│   └── RootLayout.tsx
├── pages/               # Páginas da aplicação
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── CadastroTipo.tsx
│   ├── CadastroCandidato.tsx
│   ├── CadastroEmpresa.tsx
│   ├── ValidarConta.tsx
│   ├── VagaDetalhes.tsx
│   ├── candidato/
│   │   ├── CandidatoDashboard.tsx
│   │   └── CandidatoPerfil.tsx
│   └── empresa/
│       ├── EmpresaDashboard.tsx
│       ├── VagaCriar.tsx
│       ├── VagaEditar.tsx
│       └── VagaCandidatos.tsx
├── services/            # Serviços de API
│   ├── api.ts
│   └── auth.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── routes.tsx           # Configuração de rotas
└── App.tsx              # Componente principal
```

## 🎨 Design System

### Cores
- **Primária (Candidato)**: Blue-600 (#2563EB)
- **Primária (Empresa)**: Green-600 (#16A34A)
- **Background**: Gray-50
- **Cards**: White com shadow

### Componentes
- Botões com estados hover e disabled
- Cards com shadow e hover effects
- Inputs com focus ring
- Toast notifications (Sonner)
- Loading states (spinners)

## 📊 Status das Candidaturas

- **ENVIADO**: Candidatura enviada, aguardando análise
- **EM_ANALISE**: Empresa está analisando
- **APROVADO**: Candidato aprovado
- **REJEITADO**: Candidatura rejeitada
- **DESISTIU**: Candidato desistiu da vaga

## 🔄 Endpoints da API

### Públicos
- `POST /api/auth/login` - Login
- `POST /api/candidatos` - Cadastro de candidato
- `POST /api/empresas` - Cadastro de empresa
- `POST /api/candidatos/validar` - Validar conta
- `GET /api/vagas` - Listar vagas abertas
- `GET /api/vagas/{id}` - Detalhes da vaga

### Candidato (ROLE_CANDIDATO)
- `GET /api/candidatos/perfil` - Obter perfil
- `PATCH /api/candidatos/perfil` - Atualizar perfil
- `PATCH /api/candidatos/perfil/curriculo` - Upload currículo
- `GET /api/candidatos/perfil/curriculo/visualizar` - Ver currículo
- `GET /api/candidaturas/minhas` - Minhas candidaturas
- `POST /api/candidaturas/vaga/{id}` - Candidatar-se
- `PATCH /api/candidaturas/vaga/{id}/desistir` - Desistir

### Empresa (ROLE_EMPRESA)
- `GET /api/vagas/minhas` - Minhas vagas
- `POST /api/vagas` - Criar vaga
- `PUT /api/vagas/{id}` - Editar vaga
- `DELETE /api/vagas/{id}` - Deletar vaga
- `PATCH /api/vagas/{id}/encerrar` - Encerrar vaga
- `PATCH /api/vagas/{id}/reabrir` - Reabrir vaga
- `GET /api/candidaturas/empresa/vaga/{id}/candidaturas_vaga` - Candidatos da vaga
- `PATCH /api/candidaturas/empresa/candidatura/{id}/novo_status` - Alterar status
- `PATCH /api/candidaturas/empresa/candidatura/{id}/observacoes` - Adicionar observação
- `GET /api/candidatos/perfil/curriculo/visualizar/{id}/candidatura` - Ver currículo do candidato

## 🚧 Próximos Passos

- [ ] Página 404 personalizada
- [ ] Filtros avançados de vagas
- [ ] Notificações em tempo real
- [ ] Chat entre empresa e candidato
- [ ] Dashboard com estatísticas
- [ ] Exportação de relatórios
- [ ] Sistema de favoritos
- [ ] Recuperação de senha

## 📝 Observações Importantes

1. **URL da API**: Certifique-se de atualizar a `API_BASE_URL` no arquivo `api.ts`
2. **CORS**: O backend deve estar configurado para aceitar requisições do frontend
3. **Currículo**: Apenas arquivos PDF são aceitos (máx 5MB)
4. **Token JWT**: Expira em 30 minutos (configurado no backend)
5. **Validação**: Campos em camelCase conforme DTOs do backend

## 🤝 Contribuindo

Este é um projeto acadêmico para a Fatec. Contribuições são bem-vindas!

## 📄 Licença

Este projeto é de uso educacional para a Fatec.

---

**Desenvolvido com ❤️ para a comunidade Fatec**
