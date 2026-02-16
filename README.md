# 🏦 FinControl - SaaS de Gestão Financeira

**FinControl** é uma aplicação completa de gestão financeira pessoal e empresarial, construída com arquitetura moderna e práticas de desenvolvimento profissional.

## 🚀 Stack Tecnológica

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + Glassmorphism
- **Framer Motion** para animações
- **Axios** para integração API
- **Playwright** para testes E2E

### Backend
- **Node.js** + Express
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** para autenticação
- **Jest** para testes unitários

## 📋 Funcionalidades

### Módulos Principais
- ✅ Autenticação JWT completa
- ✅ Gestão de contas bancárias
- ✅ Transações (receitas/despesas)
- ✅ Dashboard com métricas em tempo real
- ✅ Categorias personalizadas
- ✅ Orçamentos mensais
- ✅ Metas financeiras
- ✅ Relatórios detalhados

### Recursos Premium (Pro)
- Método Envelopes para controle de gastos
- Net Worth tracking
- Open Finance integração
- IA para insights financeiros
- Gamificação com conquistas

## 🛠️ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/Silas-collab/fincontrol-saas.git
cd fincontrol-saas

# Instale as dependências
cd apps/api && npm install
cd ../web && npm install

# Configure o ambiente
cd ../api
cp .env.example .env
# Edite .env com suas credenciais

# Rode as migrations
npx prisma migrate dev

# Inicie os serviços
npm run dev  # API na porta 3001
cd ../web && npm run dev  # Web na porta 3000
```

## 🧪 Testes

```bash
# Testes API (Jest)
cd apps/api
npm test

# Testes Web (Jest)
cd apps/web
npm test

# Testes E2E (Playwright)
npx playwright test
```

## 🐳 Docker

```bash
# Subir toda a stack
docker-compose up -d

# Acesse:
# - Web: http://localhost:3000
# - API: http://localhost:3001
# - Postgres: localhost:5432
# - Redis: localhost:6379
```

## 📁 Estrutura do Projeto

```
fincontrol/
├── apps/
│   ├── api/          # Backend Node.js + Express
│   └── web/          # Frontend React + TypeScript
├── docker-compose.yml
├── .github/
│   └── workflows/    # CI/CD GitHub Actions
├── architecture.md   # Documentação de arquitetura
└── design-system.md  # Sistema de design
```

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Proteção contra CSRF
- Sanitização de inputs
- Rate limiting
- Validação de schema com Zod

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ por Silas
