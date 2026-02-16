# FinControl - Arquitetura de Sistema
## Sistema de Gestão Financeira Pessoal/Profissional

**Versão:** 1.0.0  
**Data:** 16/02/2026  
**Status:** Draft

---

## 1. Visão Geral do Sistema

### 1.1 Propósito
O FinControl é um sistema de gestão financeira multi-workspace que permite:
- Controle de múltiplas contas bancárias
- Registro e categorização de transações
- Orçamento e metas financeiras
- Relatórios e análises patrimoniais
- Importação de extratos bancários
- Gestão de contas a pagar/receber

### 1.2 Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Web App    │  │  Mobile App  │  │   Browser Extension  │   │
│  │  (React 18)  │  │  (Future)    │  │     (Future)         │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
└─────────┼─────────────────┼─────────────────────┼───────────────┘
          │                 │                     │
          └─────────────────┴─────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY                                 │
├─────────────────────────────────────────────────────────────────┤
│  • Rate Limiting  • JWT Auth  • Request Validation  • CORS      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     SERVICE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Auth API   │  │ Finance API  │  │    Import API        │   │
│  │   (Porta)    │  │   (Core)     │  │   (Extratos)         │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Report API  │  │  Goal API    │  │ Notification API     │   │
│  │              │  │              │  │   (Lembretes)        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐  ┌────────▼────────┐  ┌──────▼───────┐
│    Redis      │  │   PostgreSQL    │  │   MinIO/S3   │
│    (Cache)    │  │   (Database)    │  │   (Storage)  │
│               │  │                 │  │              │
│ • Sessions    │  │ • Transactions  │  │ • Attachments│
│ • Rate Limit  │  │ • Audit Logs    │  │ • Exports    │
│ • Caching     │  │ • User Data     │  │ • Backups    │
└───────────────┘  └─────────────────┘  └──────────────┘
```

### 1.3 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | React 18 + Vite | Performance, HMR rápido, bundle otimizado |
| Estilos | Tailwind CSS | Produtividade, consistência, tree-shaking |
| Animações | Framer Motion | UX premium, interações fluidas |
| Estado | Zustand + TanStack Query | Cache inteligente, revalidação automática |
| Backend | Node.js + Express | Performance I/O, ecossistema vasto |
| ORM | Prisma | Type-safe, migrations, query builder |
| Database | PostgreSQL 15 | ACID, JSONB, Window Functions, extensões |
| Cache | Redis 7 | Sessions, rate limiting, cache distribuído |
| Auth | JWT + bcrypt | Stateless, escalável, battle-tested |
| Testes | Jest + Playwright | Unit/E2E coverage completo |
| Containers | Docker + Docker Compose | Consistência entre ambientes |

---

## 2. Modelo de Dados (Prisma Schema)

### 2.1 Schema Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== ENUMS ====================

enum AccountType {
  CHECKING        // Conta Corrente
  SAVINGS         // Conta Poupança
  CREDIT_CARD     // Cartão de Crédito
  INVESTMENT      // Investimento
  DIGITAL_WALLET  // Carteira Digital
  LOAN            // Empréstimo
  OTHER
}

enum TransactionType {
  INCOME          // Receita
  EXPENSE         // Despesa
  TRANSFER        // Transferência
}

enum TransactionStatus {
  PENDING         // Pendente
  COMPLETED       // Concluída
  CANCELLED       // Cancelada
  SCHEDULED       // Agendada
}

enum RecurrenceType {
  NONE
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
  BIMONTHLY
  QUARTERLY
  SEMIANNUAL
  ANNUAL
}

enum GoalType {
  SAVING          // Economia
  DEBT_PAYOFF     // Quitação de Dívida
  INVESTMENT      // Investimento
  PURCHASE        // Compra
  EMERGENCY_FUND  // Reserva de Emergência
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}

enum NotificationType {
  BILL_REMINDER
  GOAL_PROGRESS
  BUDGET_ALERT
  SECURITY_ALERT
  SYSTEM
}

enum ImportFormat {
  CSV
  OFX
  XLSX
  JSON
}

// ==================== ENTIDADES PRINCIPAIS ====================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String    @map("password_hash")
  firstName         String    @map("first_name")
  lastName          String    @map("last_name")
  avatarUrl         String?   @map("avatar_url")
  phone             String?
  emailVerified     Boolean   @default(false) @map("email_verified")
  twoFactorEnabled  Boolean   @default(false) @map("two_factor_enabled")
  twoFactorSecret   String?   @map("two_factor_secret")
  lastLoginAt       DateTime? @map("last_login_at")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  // Relações
  workspaces        WorkspaceMember[]
  sessions          Session[]
  notifications     Notification[]
  auditLogs         AuditLog[]
  passwordResets    PasswordReset[]
  refreshTokens     RefreshToken[]

  @@index([email])
  @@index([createdAt])
  @@map("users")
}

model Session {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  token        String   @unique
  ipAddress    String?  @map("ip_address")
  userAgent    String?  @map("user_agent")
  expiresAt    DateTime @map("expires_at")
  createdAt    DateTime @default(now()) @map("created_at")

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  revokedAt DateTime? @map("revoked_at")

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}

model PasswordReset {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime @default(now()) @map("created_at")

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@map("password_resets")
}

// ==================== WORKSPACES ====================

model Workspace {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  type        String   // PERSONAL, FAMILY, BUSINESS
  currency    String   @default("BRL")
  timezone    String   @default("America/Sao_Paulo")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relações
  members     WorkspaceMember[]
  accounts    Account[]
  categories  Category[]
  goals       Goal[]
  budgets     Budget[]
  imports     ImportJob[]
  auditLogs   AuditLog[]

  @@index([slug])
  @@map("workspaces")
}

model WorkspaceMember {
  id          String   @id @default(uuid())
  workspaceId String   @map("workspace_id")
  userId      String   @map("user_id")
  role        String   // OWNER, ADMIN, MEMBER, VIEWER
  joinedAt    DateTime @default(now()) @map("joined_at")
  invitedBy   String?  @map("invited_by")

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([userId])
  @@map("workspace_members")
}

// ==================== CONTAS ====================

model Account {
  id              String      @id @default(uuid())
  workspaceId     String      @map("workspace_id")
  name            String
  type            AccountType
  description     String?
  bankName        String?     @map("bank_name")
  bankCode        String?     @map("bank_code")
  agency          String?
  accountNumber   String?     @map("account_number")
  initialBalance  Decimal     @default(0) @map("initial_balance") @db.Decimal(15, 2)
  currentBalance  Decimal     @default(0) @map("current_balance") @db.Decimal(15, 2)
  creditLimit     Decimal?    @map("credit_limit") @db.Decimal(15, 2)
  closingDay      Int?        @map("closing_day")
  dueDay          Int?        @map("due_day")
  color           String      @default("#3B82F6")
  icon            String      @default("Wallet")
  isActive        Boolean     @default(true) @map("is_active")
  archivedAt      DateTime?   @map("archived_at")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  // Relações
  workspace       Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  transactions    Transaction[]
  fromTransfers   Transfer[]  @relation("FromAccount")
  toTransfers     Transfer[]  @relation("ToAccount")

  @@index([workspaceId])
  @@index([type])
  @@map("accounts")
}

// ==================== CATEGORIAS ====================

model Category {
  id          String   @id @default(uuid())
  workspaceId String   @map("workspace_id")
  parentId    String?  @map("parent_id")
  name        String
  type        TransactionType
  color       String   @default("#6B7280")
  icon        String   @default("Tag")
  description String?
  keywords    String[] // Para categorização automática
  isSystem    Boolean  @default(false) @map("is_system")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relações
  workspace   Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  parent      Category?    @relation("CategoryParent", fields: [parentId], references: [id])
  children    Category[]   @relation("CategoryParent")
  transactions Transaction[]
  budgets     BudgetCategory[]

  @@index([workspaceId])
  @@index([type])
  @@map("categories")
}

// ==================== TRANSações ====================

model Transaction {
  id              String            @id @default(uuid())
  workspaceId     String            @map("workspace_id")
  accountId       String            @map("account_id")
  categoryId      String?           @map("category_id")
  creditCardId    String?           @map("credit_card_id")
  
  // Dados principais
  type            TransactionType
  description     String
  amount          Decimal           @db.Decimal(15, 2)
  currency        String            @default("BRL")
  status          TransactionStatus @default(COMPLETED)
  
  // Datas
  transactionDate DateTime          @map("transaction_date")
  confirmedAt     DateTime?         @map("confirmed_at")
  
  // Recorrência
  recurrenceId    String?           @map("recurrence_id")
  
  // Metadata
  notes           String?
  tags            String[]
  attachmentUrl   String?           @map("attachment_url")
  location        Json?             // { lat, lng, address }
  
  // Importação
  importId        String?           @map("import_id")
  rawData         Json?             @map("raw_data") // Dados originais do import
  
  // Categorização inteligente
  aiConfidence    Float?            @map("ai_confidence")
  aiCategory      String?           @map("ai_category")
  
  createdAt       DateTime          @default(now()) @map("created_at")
  updatedAt       DateTime          @updatedAt @map("updated_at")

  // Relações
  workspace       Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  account         Account           @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category        Category?         @relation(fields: [categoryId], references: [id])
  recurrence      Recurrence?       @relation(fields: [recurrenceId], references: [id])
  importJob       ImportJob?        @relation(fields: [importId], references: [id])

  @@index([workspaceId, transactionDate])
  @@index([accountId, transactionDate])
  @@index([categoryId])
  @@index([type])
  @@index([status])
  @@index([recurrenceId])
  @@map("transactions")
}

model Recurrence {
  id              String          @id @default(uuid())
  workspaceId     String          @map("workspace_id")
  accountId       String          @map("account_id")
  categoryId      String?         @map("category_id")
  
  type            TransactionType
  description     String
  amount          Decimal         @db.Decimal(15, 2)
  frequency       RecurrenceType
  
  startDate       DateTime        @map("start_date")
  endDate         DateTime?       @map("end_date")
  nextOccurrence  DateTime        @map("next_occurrence")
  
  dayOfMonth      Int?            @map("day_of_month")
  dayOfWeek       Int?            @map("day_of_week")
  
  isActive        Boolean         @default(true) @map("is_active")
  autoConfirm     Boolean         @default(false) @map("auto_confirm")
  notifyBefore    Int             @default(3) @map("notify_before") // dias
  
  createdAt       DateTime        @default(now()) @map("created_at")
  updatedAt       DateTime        @updatedAt @map("updated_at")

  // Relações
  transactions    Transaction[]

  @@index([workspaceId, nextOccurrence])
  @@index([isActive, nextOccurrence])
  @@map("recurrences")
}

// ==================== TRANSFERências ====================

model Transfer {
  id              String   @id @default(uuid())
  workspaceId     String   @map("workspace_id")
  fromAccountId   String   @map("from_account_id")
  toAccountId     String   @map("to_account_id")
  
  description     String
  amount          Decimal  @db.Decimal(15, 2)
  fee             Decimal? @db.Decimal(15, 2)
  
  transferDate    DateTime @map("transfer_date")
  
  fromTransactionId String? @map("from_transaction_id")
  toTransactionId   String? @map("to_transaction_id")
  
  createdAt       DateTime @default(now()) @map("created_at")

  // Relações
  fromAccount     Account  @relation("FromAccount", fields: [fromAccountId], references: [id], onDelete: Cascade)
  toAccount       Account  @relation("ToAccount", fields: [toAccountId], references: [id], onDelete: Cascade)

  @@index([workspaceId, transferDate])
  @@index([fromAccountId])
  @@index([toAccountId])
  @@map("transfers")
}

// ==================== ORçAMENTOS ====================

model Budget {
  id            String   @id @default(uuid())
  workspaceId   String   @map("workspace_id")
  
  name          String
  description   String?
  
  startDate     DateTime @map("start_date")
  endDate       DateTime @map("end_date")
  
  totalBudgeted Decimal  @map("total_budgeted") @db.Decimal(15, 2)
  totalSpent    Decimal  @default(0) @map("total_spent") @db.Decimal(15, 2)
  
  isActive      Boolean  @default(true) @map("is_active")
  alertThreshold Int     @default(80) @map("alert_threshold") // %
  alertSent     Boolean  @default(false) @map("alert_sent")
  
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relações
  categories    BudgetCategory[]

  @@index([workspaceId, startDate, endDate])
  @@map("budgets")
}

model BudgetCategory {
  id          String  @id @default(uuid())
  budgetId    String  @map("budget_id")
  categoryId  String  @map("category_id")
  
  budgeted    Decimal @db.Decimal(15, 2)
  spent       Decimal @default(0) @db.Decimal(15, 2)

  budget      Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([budgetId, categoryId])
  @@map("budget_categories")
}

// ==================== METAS ====================

model Goal {
  id              String     @id @default(uuid())
  workspaceId     String     @map("workspace_id")
  
  name            String
  description     String?
  type            GoalType
  
  targetAmount    Decimal    @map("target_amount") @db.Decimal(15, 2)
  currentAmount   Decimal    @default(0) @map("current_amount") @db.Decimal(15, 2)
  
  startDate       DateTime   @map("start_date")
  targetDate      DateTime?  @map("target_date")
  completedAt     DateTime?  @map("completed_at")
  
  status          GoalStatus @default(ACTIVE)
  
  icon            String     @default("Target")
  color           String     @default("#10B981")
  
  autoAllocate    Boolean    @default(false) @map("auto_allocate")
  allocationPercentage Decimal? @map("allocation_percentage") @db.Decimal(5, 2)
  
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")

  // Relações
  contributions   GoalContribution[]

  @@index([workspaceId, status])
  @@map("goals")
}

model GoalContribution {
  id            String   @id @default(uuid())
  goalId        String   @map("goal_id")
  transactionId String?  @map("transaction_id")
  
  amount        Decimal  @db.Decimal(15, 2)
  description   String?
  contributedAt DateTime @default(now()) @map("contributed_at")

  goal          Goal     @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@index([goalId, contributedAt])
  @@map("goal_contributions")
}

// ==================== IMPORTAçãO ====================

model ImportJob {
  id              String       @id @default(uuid())
  workspaceId     String       @map("workspace_id")
  accountId       String       @map("account_id")
  
  format          ImportFormat
  fileName        String       @map("file_name")
  fileSize        Int          @map("file_size")
  fileUrl         String?      @map("file_url")
  
  status          String       // PENDING, PROCESSING, COMPLETED, FAILED
  progress        Int          @default(0)
  
  totalRows       Int          @default(0) @map("total_rows")
  processedRows   Int          @default(0) @map("processed_rows")
  importedRows    Int          @default(0) @map("imported_rows")
  skippedRows     Int          @default(0) @map("skipped_rows")
  errorRows       Int          @default(0) @map("error_rows")
  
  errorLog        Json?        @map("error_log")
  mappingConfig   Json?        @map("mapping_config")
  
  startedAt       DateTime?    @map("started_at")
  completedAt     DateTime?    @map("completed_at")
  createdAt       DateTime     @default(now()) @map("created_at")

  // Relações
  workspace       Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  transactions    Transaction[]

  @@index([workspaceId, status])
  @@index([accountId])
  @@map("import_jobs")
}

// ==================== NOTIFICAçãO ====================

model Notification {
  id          String           @id @default(uuid())
  userId      String           @map("user_id")
  workspaceId String?          @map("workspace_id")
  
  type        NotificationType
  title       String
  message     String
  data        Json?            // Dados adicionais contextuais
  
  readAt      DateTime?        @map("read_at")
  
  createdAt   DateTime         @default(now()) @map("created_at")

  // Relações
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, readAt])
  @@index([type])
  @@map("notifications")
}

// ==================== AUDIT LOG ====================

model AuditLog {
  id          String   @id @default(uuid())
  userId      String?  @map("user_id")
  workspaceId String?  @map("workspace_id")
  
  action      String   // CREATE, UPDATE, DELETE, LOGIN, etc
  entityType  String   @map("entity_type")
  entityId    String?  @map("entity_id")
  
  oldData     Json?    @map("old_data")
  newData     Json?    @map("new_data")
  
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  
  createdAt   DateTime @default(now()) @map("created_at")

  // Relações
  user        User?    @relation(fields: [userId], references: [id])

  @@index([workspaceId, createdAt])
  @@index([userId, createdAt])
  @@index([entityType, entityId])
  @@map("audit_logs")
}

// ==================== CONFIGURAçãO DO USUáRIO ====================

model UserSettings {
  id                    String   @id @default(uuid())
  userId                String   @unique @map("user_id")
  
  // Preferências
  defaultCurrency       String   @default("BRL") @map("default_currency")
  defaultLanguage       String   @default("pt-BR") @map("default_language")
  defaultTimezone       String   @default("America/Sao_Paulo") @map("default_timezone")
  
  // Notificações
  emailNotifications    Boolean  @default(true) @map("email_notifications")
  pushNotifications     Boolean  @default(true) @map("push_notifications")
  weeklyReport          Boolean  @default(true) @map("weekly_report")
  monthlyReport         Boolean  @default(true) @map("monthly_report")
  
  // Privacidade
  shareAnalytics        Boolean  @default(false) @map("share_analytics")
  
  // Segurança
  sessionTimeout        Int      @default(30) @map("session_timeout") // minutos
  requirePasswordFor    Json     @default("[\"export\", \"delete\"]") @map("require_password_for")
  
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  @@map("user_settings")
}

---

## 3. API REST - Endpoints

### 3.1 Convenções
- Base URL: `/api/v1`
- Formato de resposta: JSON
- Autenticação: JWT Bearer Token
- Paginação: `?page=1&limit=20`
- Filtros: `?filter[key]=value`
- Ordenação: `?sort=-createdAt`

### 3.2 Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Registro de novo usuário | ❌ |
| POST | `/auth/login` | Login com email/senha | ❌ |
| POST | `/auth/refresh` | Renovar access token | ✅ |
| POST | `/auth/logout` | Logout (revoke token) | ✅ |
| POST | `/auth/forgot-password` | Solicitar reset de senha | ❌ |
| POST | `/auth/reset-password` | Confirmar reset de senha | ❌ |
| POST | `/auth/verify-email` | Verificar email | ❌ |
| POST | `/auth/2fa/setup` | Configurar 2FA | ✅ |
| POST | `/auth/2fa/verify` | Verificar código 2FA | ✅ |
| POST | `/auth/2fa/disable` | Desativar 2FA | ✅ |

**Request/Response Examples:**

```json
// POST /auth/login
{
  "email": "usuario@email.com",
  "password": "senhaSegura123"
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "usuario@email.com",
      "firstName": "João",
      "lastName": "Silva"
    }
  }
}
```

### 3.3 Workspaces

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces` | Listar workspaces do usuário |
| POST | `/workspaces` | Criar novo workspace |
| GET | `/workspaces/:id` | Detalhes do workspace |
| PUT | `/workspaces/:id` | Atualizar workspace |
| DELETE | `/workspaces/:id` | Arquivar workspace |
| GET | `/workspaces/:id/members` | Listar membros |
| POST | `/workspaces/:id/members` | Convidar membro |
| PUT | `/workspaces/:id/members/:userId` | Atualizar papel |
| DELETE | `/workspaces/:id/members/:userId` | Remover membro |

```json
// POST /workspaces
{
  "name": "Finanças Pessoais",
  "slug": "financas-pessoais",
  "type": "PERSONAL",
  "currency": "BRL",
  "description": "Minhas finanças pessoais"
}

// Response 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Finanças Pessoais",
    "slug": "financas-pessoais",
    "type": "PERSONAL",
    "currency": "BRL",
    "role": "OWNER",
    "createdAt": "2026-02-16T12:00:00Z"
  }
}
```

### 3.4 Contas (Accounts)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/accounts` | Listar contas |
| POST | `/workspaces/:id/accounts` | Criar conta |
| GET | `/workspaces/:id/accounts/:accountId` | Detalhes da conta |
| PUT | `/workspaces/:id/accounts/:accountId` | Atualizar conta |
| DELETE | `/workspaces/:id/accounts/:accountId` | Arquivar conta |
| GET | `/workspaces/:id/accounts/:accountId/balance` | Saldo e extrato |
| GET | `/workspaces/:id/accounts/:accountId/statement` | Extrato detalhado |

```json
// POST /workspaces/:id/accounts
{
  "name": "Nubank",
  "type": "CREDIT_CARD",
  "bankName": "Nu Pagamentos",
  "bankCode": "260",
  "creditLimit": 5000.00,
  "closingDay": 5,
  "dueDay": 12,
  "color": "#8B10AE",
  "initialBalance": 0
}

// Response 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nubank",
    "type": "CREDIT_CARD",
    "currentBalance": 0,
    "availableCredit": 5000.00,
    "closingDay": 5,
    "dueDay": 12,
    "createdAt": "2026-02-16T12:00:00Z"
  }
}
```

### 3.5 Transações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/transactions` | Listar transações |
| POST | `/workspaces/:id/transactions` | Criar transação |
| GET | `/workspaces/:id/transactions/:txId` | Detalhes |
| PUT | `/workspaces/:id/transactions/:txId` | Atualizar |
| DELETE | `/workspaces/:id/transactions/:txId` | Excluir (soft) |
| POST | `/workspaces/:id/transactions/bulk` | Criar em lote |
| POST | `/workspaces/:id/transactions/:txId/split` | Dividir transação |
| POST | `/workspaces/:id/transactions/:txId/duplicate` | Duplicar |

**Parâmetros de Query:**
```
GET /workspaces/:id/transactions?
  &accountId=uuid
  &categoryId=uuid
  &type=EXPENSE
  &startDate=2026-01-01
  &endDate=2026-02-28
  &minAmount=100
  &maxAmount=1000
  &search=mercado
  &tags=tag1,tag2
  &status=COMPLETED
  &page=1
  &limit=50
  &sort=-transactionDate
```

```json
// POST /workspaces/:id/transactions
{
  "accountId": "uuid",
  "type": "EXPENSE",
  "description": "Supermercado Extra",
  "amount": 350.75,
  "transactionDate": "2026-02-15",
  "categoryId": "uuid",
  "notes": "Compras do mês",
  "tags": ["alimentação", "essencial"],
  "location": {
    "lat": -23.5505,
    "lng": -46.6333,
    "address": "Av. Paulista, 1000"
  }
}

// Response 201
{
  "success": true,
  "data": {
    "id": "uuid",
    "accountId": "uuid",
    "account": { "name": "Nubank", "type": "CREDIT_CARD" },
    "category": { "name": "Alimentação", "color": "#F59E0B" },
    "type": "EXPENSE",
    "description": "Supermercado Extra",
    "amount": 350.75,
    "transactionDate": "2026-02-15",
    "status": "COMPLETED",
    "balanceAfter": 350.75,
    "createdAt": "2026-02-16T12:00:00Z"
  }
}
```

### 3.6 Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/categories` | Listar categorias |
| POST | `/workspaces/:id/categories` | Criar categoria |
| GET | `/workspaces/:id/categories/:catId` | Detalhes |
| PUT | `/workspaces/:id/categories/:catId` | Atualizar |
| DELETE | `/workspaces/:id/categories/:catId` | Excluir |
| GET | `/workspaces/:id/categories/summary` | Resumo por categoria |

```json
// POST /workspaces/:id/categories
{
  "name": "Restaurantes",
  "type": "EXPENSE",
  "color": "#EF4444",
  "icon": "Utensils",
  "parentId": "uuid-da-categoria-alimentação",
  "keywords": ["restaurante", "lanchonete", "padaria", "ifood"]
}
```

### 3.7 Transferências

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/transfers` | Listar transferências |
| POST | `/workspaces/:id/transfers` | Criar transferência |
| GET | `/workspaces/:id/transfers/:id` | Detalhes |
| PUT | `/workspaces/:id/transfers/:id` | Atualizar |
| DELETE | `/workspaces/:id/transfers/:id` | Cancelar |

```json
// POST /workspaces/:id/transfers
{
  "fromAccountId": "conta-corrente-uuid",
  "toAccountId": "poupança-uuid",
  "amount": 1000.00,
  "fee": 0,
  "description": "Reserva de emergência",
  "transferDate": "2026-02-16"
}
```

### 3.8 Orçamentos (Budgets)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/budgets` | Listar orçamentos |
| POST | `/workspaces/:id/budgets` | Criar orçamento |
| GET | `/workspaces/:id/budgets/:id` | Detalhes |
| PUT | `/workspaces/:id/budgets/:id` | Atualizar |
| DELETE | `/workspaces/:id/budgets/:id` | Excluir |
| GET | `/workspaces/:id/budgets/:id/progress` | Progresso atual |

```json
// POST /workspaces/:id/budgets
{
  "name": "Orçamento Fevereiro 2026",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28",
  "categories": [
    { "categoryId": "uuid-alimentação", "budgeted": 1500.00 },
    { "categoryId": "uuid-transporte", "budgeted": 800.00 },
    { "categoryId": "uuid-lazer", "budgeted": 500.00 }
  ],
  "alertThreshold": 80
}

// Response com progresso
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Orçamento Fevereiro 2026",
    "totalBudgeted": 2800.00,
    "totalSpent": 1450.00,
    "remaining": 1350.00,
    "progress": 51.8,
    "categories": [
      {
        "categoryId": "uuid-alimentação",
        "categoryName": "Alimentação",
        "budgeted": 1500.00,
        "spent": 1200.00,
        "remaining": 300.00,
        "progress": 80.0,
        "alertTriggered": true
      }
    ],
    "status": "on_track" // on_track, warning, exceeded
  }
}
```

### 3.9 Metas (Goals)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/goals` | Listar metas |
| POST | `/workspaces/:id/goals` | Criar meta |
| GET | `/workspaces/:id/goals/:id` | Detalhes |
| PUT | `/workspaces/:id/goals/:id` | Atualizar |
| DELETE | `/workspaces/:id/goals/:id` | Excluir |
| POST | `/workspaces/:id/goals/:id/contribute` | Contribuir |
| GET | `/workspaces/:id/goals/:id/contributions` | Histórico |

```json
// POST /workspaces/:id/goals
{
  "name": "Viagem para Europa",
  "description": "Viagem de férias 2027",
  "type": "SAVING",
  "targetAmount": 15000.00,
  "targetDate": "2027-06-01",
  "icon": "Plane",
  "color": "#3B82F6",
  "autoAllocate": true,
  "allocationPercentage": 10.0
}

// POST /workspaces/:id/goals/:id/contribute
{
  "amount": 500.00,
  "description": "Sobras do mês",
  "accountId": "uuid-conta"
}
```

### 3.10 Recorrências

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/recurrences` | Listar recorrências |
| POST | `/workspaces/:id/recurrences` | Criar recorrência |
| GET | `/workspaces/:id/recurrences/:id` | Detalhes |
| PUT | `/workspaces/:id/recurrences/:id` | Atualizar |
| DELETE | `/workspaces/:id/recurrences/:id` | Cancelar |
| POST | `/workspaces/:id/recurrences/:id/generate` | Gerar instância manual |

```json
// POST /workspaces/:id/recurrences
{
  "accountId": "uuid",
  "categoryId": "uuid",
  "type": "EXPENSE",
  "description": "Netflix",
  "amount": 39.90,
  "frequency": "MONTHLY",
  "startDate": "2026-02-01",
  "dayOfMonth": 10,
  "autoConfirm": true,
  "notifyBefore": 3
}
```

### 3.11 Importação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/workspaces/:id/imports` | Iniciar importação |
| GET | `/workspaces/:id/imports` | Listar imports |
| GET | `/workspaces/:id/imports/:id` | Status do import |
| GET | `/workspaces/:id/imports/:id/preview` | Pré-visualização |
| POST | `/workspaces/:id/imports/:id/confirm` | Confirmar import |
| DELETE | `/workspaces/:id/imports/:id` | Cancelar |
| POST | `/workspaces/:id/imports/:id/map-columns` | Mapear colunas |

```json
// POST /workspaces/:id/imports (multipart/form-data)
{
  "accountId": "uuid",
  "format": "CSV",
  "file": [File],
  "dateFormat": "DD/MM/YYYY",
  "decimalSeparator": ",",
  "encoding": "UTF-8"
}

// Response
{
  "success": true,
  "data": {
    "id": "import-uuid",
    "status": "PENDING",
    "totalRows": 150,
    "progress": 0,
    "mappingRequired": true
  }
}

// POST /workspaces/:id/imports/:id/map-columns
{
  "mappings": {
    "date": 0,
    "description": 1,
    "amount": 2,
    "type": 3,
    "category": 4
  },
  "transforms": {
    "amount": "abs",
    "type": { "C": "CREDIT", "D": "DEBIT" }
  }
}
```

### 3.12 Relatórios & Dashboards

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/workspaces/:id/dashboard` | Resumo dashboard |
| GET | `/workspaces/:id/reports/cash-flow` | Fluxo de caixa |
| GET | `/workspaces/:id/reports/income-expense` | Receitas vs Despesas |
| GET | `/workspaces/:id/reports/by-category` | Por categoria |
| GET | `/workspaces/:id/reports/net-worth` | Evolução patrimonial |
| GET | `/workspaces/:id/reports/credit-cards` | Análise cartões |
| POST | `/workspaces/:id/reports/export` | Exportar relatório |

```json
// GET /workspaces/:id/dashboard?period=month&date=2026-02
{
  "success": true,
  "data": {
    "period": { "start": "2026-02-01", "end": "2026-02-28" },
    "summary": {
      "income": 8500.00,
      "expense": 6200.00,
      "balance": 2300.00,
      "previousPeriodChange": 15.2
    },
    "accounts": [
      { "id": "uuid", "name": "Nubank", "balance": 1200.00, "type": "CREDIT_CARD" }
    ],
    "upcomingBills": [
      { "description": "Aluguel", "amount": 2000.00, "dueDate": "2026-02-10" }
    ],
    "goalsProgress": [
      { "name": "Viagem Europa", "progress": 45.5, "daysRemaining": 120 }
    ],
    "budgetAlerts": [
      { "category": "Alimentação", "budgeted": 1500, "spent": 1400, "percentage": 93.3 }
    ],
    "chartData": {
      "cashFlow": [
        { "date": "2026-02-01", "income": 0, "expense": 150 },
        { "date": "2026-02-02", "income": 0, "expense": 45 },
        // ...
      ],
      "byCategory": [
        { "category": "Alimentação", "amount": 1200, "percentage": 19.4, "color": "#F59E0B" },
        { "category": "Transporte", "amount": 800, "percentage": 12.9, "color": "#3B82F6" }
      ]
    }
  }
}
```

### 3.13 Notificações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notifications` | Listar notificações |
| PUT | `/notifications/:id/read` | Marcar como lida |
| PUT | `/notifications/read-all` | Marcar todas |
| DELETE | `/notifications/:id` | Excluir |
| GET | `/notifications/unread-count` | Contagem não lidas |
| PUT | `/notifications/preferences` | Preferências |

### 3.14 Configurações do Usuário

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/user/settings` | Obter configurações |
| PUT | `/user/settings` | Atualizar configurações |
| GET | `/user/profile` | Perfil do usuário |
| PUT | `/user/profile` | Atualizar perfil |
| PUT | `/user/password` | Alterar senha |
| DELETE | `/user/account` | Excluir conta |

---

## 4. Estrutura de Pastas

```
fincontrol/
├── 📁 apps/
│   ├── 📁 web/                          # Frontend React
│   │   ├── 📁 public/
│   │   │   ├── favicon.ico
│   │   │   ├── logo.svg
│   │   │   └── locales/                 # i18n
│   │   │       ├── pt-BR/
│   │   │       └── en/
│   │   │
│   │   ├── 📁 src/
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 ui/               # Componentes atômicos
│   │   │   │   │   ├── Button/
│   │   │   │   │   │   ├── Button.tsx
│   │   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── Input/
│   │   │   │   │   ├── Card/
│   │   │   │   │   ├── Modal/
│   │   │   │   │   ├── Select/
│   │   │   │   │   ├── DatePicker/
│   │   │   │   │   ├── CurrencyInput/
│   │   │   │   │   ├── Badge/
│   │   │   │   │   ├── Skeleton/
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── 📁 forms/            # Formulários
│   │   │   │   │   ├── TransactionForm/
│   │   │   │   │   ├── AccountForm/
│   │   │   │   │   ├── BudgetForm/
│   │   │   │   │   ├── GoalForm/
│   │   │   │   │   └── ImportForm/
│   │   │   │   │
│   │   │   │   ├── 📁 layout/           # Layout components
│   │   │   │   │   ├── AppLayout/
│   │   │   │   │   ├── Sidebar/
│   │   │   │   │   ├── Header/
│   │   │   │   │   ├── WorkspaceSwitcher/
│   │   │   │   │   └── Navigation/
│   │   │   │   │
│   │   │   │   ├── 📁 dashboard/        # Dashboard widgets
│   │   │   │   │   ├── BalanceCard/
│   │   │   │   │   ├── CashFlowChart/
│   │   │   │   │   ├── CategoryChart/
│   │   │   │   │   ├── RecentTransactions/
│   │   │   │   │   ├── UpcomingBills/
│   │   │   │   │   └── GoalsProgress/
│   │   │   │   │
│   │   │   │   ├── 📁 transactions/     # Transaction components
│   │   │   │   │   ├── TransactionList/
│   │   │   │   │   ├── TransactionItem/
│   │   │   │   │   ├── TransactionFilter/
│   │   │   │   │   └── TransactionBulkActions/
│   │   │   │   │
│   │   │   │   └── 📁 charts/           # Recharts components
│   │   │   │       ├── AreaChart/
│   │   │   │       ├── PieChart/
│   │   │   │       ├── BarChart/
│   │   │   │       └── DonutChart/
│   │   │   │
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useWorkspace.ts
│   │   │   │   ├── useTransactions.ts
│   │   │   │   ├── useAccounts.ts
│   │   │   │   ├── useCategories.ts
│   │   │   │   ├── useBudgets.ts
│   │   │   │   ├── useGoals.ts
│   │   │   │   ├── useDashboard.ts
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   └── useDebounce.ts
│   │   │   │
│   │   │   ├── 📁 stores/               # Zustand stores
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── workspaceStore.ts
│   │   │   │   ├── uiStore.ts
│   │   │   │   └── notificationStore.ts
│   │   │   │
│   │   │   ├── 📁 api/                  # API layer
│   │   │   │   ├── client.ts            # Axios instance
│   │   │   │   ├── interceptors.ts
│   │   │   │   ├── 📁 services/
│   │   │   │   │   ├── authService.ts
│   │   │   │   │   ├── workspaceService.ts
│   │   │   │   │   ├── accountService.ts
│   │   │   │   │   ├── transactionService.ts
│   │   │   │   │   ├── categoryService.ts
│   │   │   │   │   ├── budgetService.ts
│   │   │   │   │   ├── goalService.ts
│   │   │   │   │   ├── importService.ts
│   │   │   │   │   ├── reportService.ts
│   │   │   │   │   └── notificationService.ts
│   │   │   │   └── 📁 types/
│   │   │   │       └── api.types.ts
│   │   │   │
│   │   │   ├── 📁 pages/                # Route pages
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── Login.tsx
│   │   │   │   │   ├── Register.tsx
│   │   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   │   └── ResetPassword.tsx
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── Dashboard.tsx
│   │   │   │   ├── Accounts/
│   │   │   │   │   ├── AccountsList.tsx
│   │   │   │   │   └── AccountDetail.tsx
│   │   │   │   ├── Transactions/
│   │   │   │   │   ├── TransactionsList.tsx
│   │   │   │   │   └── TransactionDetail.tsx
│   │   │   │   ├── Categories/
│   │   │   │   │   └── Categories.tsx
│   │   │   │   ├── Budgets/
│   │   │   │   │   ├── BudgetsList.tsx
│   │   │   │   │   └── BudgetDetail.tsx
│   │   │   │   ├── Goals/
│   │   │   │   │   ├── GoalsList.tsx
│   │   │   │   │   └── GoalDetail.tsx
│   │   │   │   ├── Reports/
│   │   │   │   │   ├── CashFlow.tsx
│   │   │   │   │   ├── ByCategory.tsx
│   │   │   │   │   └── NetWorth.tsx
│   │   │   │   ├── Imports/
│   │   │   │   │   └── ImportWizard.tsx
│   │   │   │   └── Settings/
│   │   │   │       ├── Profile.tsx
│   │   │   │       ├── Workspace.tsx
│   │   │   │       └── Preferences.tsx
│   │   │   │
│   │   │   ├── 📁 lib/
│   │   │   │   ├── utils.ts             # Utility functions
│   │   │   │   ├── formatters.ts        # Currency, date formatters
│   │   │   │   ├── validators.ts        # Form validation
│   │   │   │   ├── constants.ts
│   │   │   │   └── colors.ts
│   │   │   │
│   │   │   ├── 📁 types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── workspace.types.ts
│   │   │   │   ├── account.types.ts
│   │   │   │   ├── transaction.types.ts
│   │   │   │   ├── category.types.ts
│   │   │   │   ├── budget.types.ts
│   │   │   │   ├── goal.types.ts
│   │   │   │   └── report.types.ts
│   │   │   │
│   │   │   ├── 📁 utils/
│   │   │   │   ├── test-utils.tsx
│   │   │   │   └── mocks/
│   │   │   │       ├── handlers.ts
│   │   │   │       └── data.ts
│   │   │   │
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── router.tsx
│   │   │
│   │   ├── 📁 e2e/                      # Playwright tests
│   │   │   ├── auth.spec.ts
│   │   │   ├── dashboard.spec.ts
│   │   │   ├── transactions.spec.ts
│   │   │   └── fixtures/
│   │   │
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   ├── jest.config.js
│   │   ├── playwright.config.ts
│   │   └── package.json
│   │
│   └── 📁 api/                          # Backend Node.js
│       ├── 📁 prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       │
│       ├── 📁 src/
│       │   ├── 📁 config/
│       │   │   ├── database.ts
│       │   │   ├── redis.ts
│       │   │   ├── logger.ts
│       │   │   └── env.ts
│       │   │
│       │   ├── 📁 middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   ├── validation.middleware.ts
│       │   │   ├── rateLimit.middleware.ts
│       │   │   ├── audit.middleware.ts
│       │   │   └── workspace.middleware.ts
│       │   │
│       │   ├── 📁 routes/
│       │   │   ├── index.ts
│       │   │   ├── auth.routes.ts
│       │   │   ├── workspace.routes.ts
│       │   │   ├── account.routes.ts
│       │   │   ├── transaction.routes.ts
│       │   │   ├── category.routes.ts
│       │   │   ├── transfer.routes.ts
│       │   │   ├── budget.routes.ts
│       │   │   ├── goal.routes.ts
│       │   │   ├── recurrence.routes.ts
│       │   │   ├── import.routes.ts
│       │   │   ├── report.routes.ts
│       │   │   ├── notification.routes.ts
│       │   │   └── user.routes.ts
│       │   │
│       │   ├── 📁 controllers/
│       │   │   ├── auth.controller.ts
│       │   │   ├── workspace.controller.ts
│       │   │   ├── account.controller.ts
│       │   │   ├── transaction.controller.ts
│       │   │   ├── category.controller.ts
│       │   │   ├── transfer.controller.ts
│       │   │   ├── budget.controller.ts
│       │   │   ├── goal.controller.ts
│       │   │   ├── recurrence.controller.ts
│       │   │   ├── import.controller.ts
│       │   │   ├── report.controller.ts
│       │   │   ├── notification.controller.ts
│       │   │   └── user.controller.ts
│       │   │
│       │   ├── 📁 services/
│       │   │   ├── auth.service.ts
│       │   │   ├── workspace.service.ts
│       │   │   ├── account.service.ts
│       │   │   ├── transaction.service.ts
│       │   │   ├── category.service.ts
│       │   │   ├── transfer.service.ts
│       │   │   ├── budget.service.ts
│       │   │   ├── goal.service.ts
│       │   │   ├── recurrence.service.ts
│       │   │   ├── import.service.ts
│       │   │   │   ├── parsers/
│       │   │   │   │   ├── csv.parser.ts
│       │   │   │   │   ├── ofx.parser.ts
│       │   │   │   │   └── xlsx.parser.ts
│       │   │   │   └── ai-categorizer.ts
│       │   │   ├── report.service.ts
│       │   │   ├── notification.service.ts
│       │   │   ├── user.service.ts
│       │   │   └── cache.service.ts
│       │   │
│       │   ├── 📁 repositories/
│       │   │   ├── base.repository.ts
│       │   │   ├── user.repository.ts
│       │   │   ├── workspace.repository.ts
│       │   │   ├── account.repository.ts
│       │   │   ├── transaction.repository.ts
│       │   │   └── ...
│       │   │
│       │   ├── 📁 validators/
│       │   │   ├── auth.validator.ts
│       │   │   ├── transaction.validator.ts
│       │   │   └── ...
│       │   │
│       │   ├── 📁 types/
│       │   │   ├── express.d.ts
│       │   │   ├── api.types.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── 📁 utils/
│       │   │   ├── encryption.ts
│       │   │   ├── token.ts
│       │   │   ├── password.ts
│       │   │   ├── currency.ts
│       │   │   └── date.ts
│       │   │
│       │   ├── 📁 jobs/
│       │   │   ├── recurrence.job.ts
│       │   │   ├── notification.job.ts
│       │   │   └── report.job.ts
│       │   │
│       │   ├── 📁 workers/
│       │   │   └── import.worker.ts
│       │   │
│       │   └── index.ts
│       │
│       ├── 📁 tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── fixtures/
│       │
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── tsconfig.json
│       ├── jest.config.js
│       └── package.json
│
├── 📁 packages/
│   ├── 📁 shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── constants/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── 📁 ui/                           # Componentes compartilhados
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── 📁 infrastructure/
│   ├── 📁 docker/
│   │   ├── Dockerfile.web
│   │   ├── Dockerfile.api
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.prod.yml
│   │   └── nginx/
│   │       ├── nginx.conf
│   │       └── ssl/
│   │
│   ├── 📁 terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   │
│   └── 📁 kubernetes/
│       ├── namespace.yaml
│       ├── deployment-web.yaml
│       ├── deployment-api.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       └── configmap.yaml
│
├── 📁 docs/
│   ├── architecture.md
│   ├── design-system.md
│   ├── api-reference.md
│   ├── security.md
│   └── deployment.md
│
├── 📁 scripts/
│   ├── setup.sh
│   ├── dev.sh
│   ├── test.sh
│   └── deploy.sh
│
├── .gitignore
├── .env.example
├── turbo.json
├── package.json
└── README.md
```


---

## 5. Fluxos de Dados Principais

### 5.1 Fluxo de Autenticação

```
┌─────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────┐
│ Cliente │────▶│  POST/login  │────▶│  Auth Service   │────▶│  Redis   │
└─────────┘     └──────────────┘     └─────────────────┘     └──────────┘
                                              │                      ▲
                                              │                      │
                                              ▼                      │
                                       ┌─────────────┐               │
                                       │  PostgreSQL │               │
                                       │   (Users)   │               │
                                       └─────────────┘               │
                                              │                      │
                                              │                      │
                                              ▼                      │
                                       ┌─────────────────┐           │
                                       │  JWT Generator  │───────────┘
                                       │  (Access/Refresh)│
                                       └─────────────────┘
                                              │
                                              ▼
                                       ┌─────────────────┐
                                       │   Response      │
                                       │ {access, refresh}│
                                       └─────────────────┘
```

**Passos Detalhados:**
1. Cliente envia email + senha
2. Middleware valida formato (zod/joi)
3. Busca usuário no PostgreSQL (com hash da senha)
4. Compara senha com bcrypt (cost factor 12)
5. Verifica se 2FA está habilitado
6. Gera JWT access token (15 min) + refresh token (7 dias)
7. Armazena refresh token hasheado no Redis (blacklist capability)
8. Retorna tokens + dados do usuário
9. Cliente armazena em httpOnly cookies

### 5.2 Fluxo de Transação Financeira

```
┌─────────┐     ┌──────────────────┐     ┌──────────────────────┐
│ Cliente │────▶│ POST/transaction │────▶│ Validation Middleware │
└─────────┘     └──────────────────┘     └──────────────────────┘
                                                     │
                                                     ▼
                                          ┌────────────────────┐
                                          │  Rate Limit Check  │
                                          │  (Redis: 100 req/min)│
                                          └────────────────────┘
                                                     │
                                                     ▼
                                          ┌────────────────────┐
                                          │  Workspace Access  │
                                          │  (Member check)    │
                                          └────────────────────┘
                                                     │
                                                     ▼
                              ┌──────────────────────┴──────────────────────┐
                              │              Transaction Service            │
                              │  ┌─────────────────────────────────────┐   │
                              │  │  1. Validar saldo (se necessário)   │   │
                              │  │  2. Criar transação (PENDING)       │   │
                              │  │  3. Atualizar saldo da conta        │   │
                              │  │  4. Atualizar orçamentos            │   │
                              │  │  5. Atualizar metas (se aplicável)  │   │
                              │  │  6. Criar audit log                 │   │
                              │  │  7. Commit transação                │   │
                              │  └─────────────────────────────────────┘   │
                              └──────────────────────┬──────────────────────┘
                                                     │
                              ┌──────────────────────┼──────────────────────┐
                              ▼                      ▼                      ▼
                       ┌──────────┐          ┌──────────┐          ┌──────────┐
                       │PostgreSQL│          │  Redis   │          │ Queue    │
                       │(Prisma TX)│         │(Cache)   │          │(BullMQ)  │
                       └──────────┘          └──────────┘          └──────────┘
                                                                           │
                                                                           ▼
                                                                   ┌──────────────┐
                                                                   │ Notification │
                                                                   │   Worker     │
                                                                   └──────────────┘
```

**Transação atômica Prisma:**
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Criar transação
  const transaction = await tx.transaction.create({
    data: { accountId, amount, type, status: 'COMPLETED' }
  });
  
  // 2. Atualizar saldo
  await tx.account.update({
    where: { id: accountId },
    data: { 
      currentBalance: { 
        increment: type === 'INCOME' ? amount : -amount 
      } 
    }
  });
  
  // 3. Atualizar orçamento
  await tx.budgetCategory.updateMany({
    where: { categoryId, budget: { startDate: { lte: date }, endDate: { gte: date } } },
    data: { spent: { increment: amount } }
  });
  
  // 4. Audit log
  await tx.auditLog.create({
    data: { action: 'CREATE', entityType: 'Transaction', entityId: transaction.id, newData: transaction }
  });
});
```

### 5.3 Fluxo de Importação de Extratos

```
┌──────────┐     ┌─────────────┐     ┌──────────────────────┐
│  Upload  │────▶│  /imports   │────▶│  Validation (size,   │
│  CSV/OFX │     │  (multipart)│     │  type, virus scan)   │
└──────────┘     └─────────────┘     └──────────────────────┘
                                                │
                                                ▼
                                      ┌─────────────────────┐
                                      │   Store to MinIO    │
                                      │   (temporary)       │
                                      └─────────────────────┘
                                                │
                                                ▼
                                      ┌─────────────────────┐
                                      │  Queue Import Job   │
                                      │  (BullMQ)           │
                                      └─────────────────────┘
                                                │
                                                ▼
                                      ┌─────────────────────┐
                                      │   Import Worker     │
                                      │  ┌───────────────┐  │
                                      │  │ Parse file    │  │
                                      │  │ Detect format │  │
                                      │  │ Map columns   │  │
                                      │  │ Validate rows │  │
                                      │  │ AI categorize │  │
                                      │  │ Create trans  │  │
                                      │  └───────────────┘  │
                                      └─────────────────────┘
                                                │
                              ┌─────────────────┼─────────────────┐
                              ▼                 ▼                 ▼
                       ┌──────────┐      ┌──────────┐      ┌──────────┐
                       │ WebSocket│      │PostgreSQL│      │ Cleanup  │
                       │ progress │      │(transactions)    │ temp file│
                       └──────────┘      └──────────┘      └──────────┘
```

### 5.4 Fluxo de Recorrência

```
┌──────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│ Cron Job     │────▶│  Recurrence Worker  │────▶│  Query recorrências │
│ (every hour) │     │  (node-cron/Bull)   │     │  vencendo hoje      │
└──────────────┘     └─────────────────────┘     └─────────────────────┘
                                                            │
                                                            ▼
                                                   ┌─────────────────┐
                                                   │ For each due:   │
                                                   │ 1. Criar trans  │
                                                   │ 2. Calcular next│
                                                   │ 3. Atualizar    │
                                                   │ 4. Notificar    │
                                                   └─────────────────┘
                                                            │
                              ┌─────────────────────────────┼─────────────────────────────┐
                              ▼                             ▼                             ▼
                       ┌──────────┐                  ┌──────────┐                  ┌──────────┐
                       │Transaction│                 │ Recurrence│                 │ Notification│
                       │ (new)    │                  │ (update)  │                  │ (queue)    │
                       └──────────┘                  └──────────┘                  └──────────┘
```

### 5.5 Fluxo de Relatórios (Cache Strategy)

```
┌─────────┐     ┌───────────────┐     ┌─────────────────────┐
│ Cliente │────▶│ GET /dashboard│────▶│ Cache Check (Redis) │
└─────────┘     └───────────────┘     └─────────────────────┘
                                                │
                           Cache HIT ───────────┴─────────── Cache MISS
                              │                              │
                              ▼                              ▼
                       ┌──────────┐                ┌─────────────────┐
                       │ Return   │                │ Query Database  │
                       │ cached   │                │ (aggregations)  │
                       │ (10min)  │                └─────────────────┘
                       └──────────┘                            │
                                                                ▼
                                                       ┌─────────────────┐
                                                       │ Store in Redis  │
                                                       │ (compressed)    │
                                                       └─────────────────┘
                                                                │
                                                                ▼
                                                       ┌─────────────────┐
                                                       │ Return data     │
                                                       └─────────────────┘
```

---

## 6. Considerações de Segurança

### 6.1 Visão Geral de Segurança

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LAYERS OF SECURITY                               │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 1: Network Security                                          │
│  • HTTPS/TLS 1.3 apenas                                             │
│  • WAF (CloudFlare/AWS WAF)                                         │
│  • DDoS protection                                                  │
│  • IP whitelisting para admin                                       │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 2: Application Security                                      │
│  • Rate limiting (100 req/min por IP)                               │
│  • CORS restrito                                                    │
│  • CSP headers                                                      │
│  • Input validation (zod/joi)                                       │
│  • SQL injection prevention (Prisma ORM)                            │
│  • XSS protection (output encoding)                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 3: Authentication & Authorization                            │
│  • JWT com refresh tokens                                           │
│  • bcrypt com cost factor 12+                                       │
│  • 2FA (TOTP)                                                       │
│  • RBAC (Role-Based Access Control)                                 │
│  • Session management                                               │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 4: Data Security                                             │
│  • AES-256 encryption at rest                                       │
│  • TLS 1.3 in transit                                               │
│  • Field-level encryption (dados sensíveis)                         │
│  • Database row-level security                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 5: Audit & Compliance                                        │
│  • Audit logs imutáveis                                             │
│  • LGPD/GDPR compliance                                             │
│  • Backup encryption                                                │
│  • Retention policies                                               │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Criptografia de Dados

#### Em Repouso (At Rest)
```typescript
// PostgreSQL com TDE (Transparent Data Encryption)
// ou
// Field-level encryption para dados sensíveis

import crypto from 'crypto';

class FieldEncryption {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  
  constructor(masterKey: string) {
    this.key = crypto.scryptSync(masterKey, 'salt', 32);
  }
  
  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
  
  decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(ivHex, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Uso para campos sensíveis
const encryption = new FieldEncryption(process.env.FIELD_ENCRYPTION_KEY);

// Antes de salvar
const encryptedAccountNumber = encryption.encrypt(accountNumber);

// Ao recuperar
const decryptedAccountNumber = encryption.decrypt(encryptedAccountNumber);
```

**Campos criptografados:**
- Números de contas bancárias
- Dados de cartões (se armazenados - preferir tokenização)
- Documentos de identificação
- Informações fiscais

#### Em Trânsito (In Transit)
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    
    # TLS 1.3 apenas
    ssl_protocols TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Certificate pinning (opcional)
    add_header Public-Key-Pins 'pin-sha256="base64+primary=="; pin-sha256="base64+backup=="; max-age=5184000; includeSubDomains';
}
```

### 6.3 Autenticação Segura

#### JWT Configuration
```typescript
// config/auth.ts
export const authConfig = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: '15m', // Curto para segurança
    algorithm: 'HS256'
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: '7d',
    algorithm: 'HS256'
  },
  bcrypt: {
    rounds: 12 // Mínimo recomendado
  }
};

// Middleware de autenticação
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido');
    }
    
    const token = authHeader.substring(7);
    
    // Verificar blacklist no Redis
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token revogado');
    }
    
    // Verificar token
    const decoded = jwt.verify(token, authConfig.accessToken.secret) as JWTPayload;
    
    // Verificar se usuário ainda existe e está ativo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isActive: true }
    });
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuário inválido');
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    next(error);
  }
};
```

#### Refresh Token Rotation
```typescript
// Implementação segura de refresh tokens
export const rotateRefreshToken = async (oldToken: string) => {
  // Verificar se token foi revogado
  const stored = await prisma.refreshToken.findUnique({
    where: { token: hashToken(oldToken) },
    include: { user: true }
  });
  
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    // Possível tentativa de replay attack - revogar todos os tokens do usuário
    await revokeAllUserTokens(stored?.userId);
    throw new UnauthorizedError('Token inválido');
  }
  
  // Revogar token antigo
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() }
  });
  
  // Gerar novo par de tokens
  const tokens = generateTokenPair(stored.user);
  
  // Armazenar novo refresh token
  await prisma.refreshToken.create({
    data: {
      userId: stored.user.id,
      token: hashToken(tokens.refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  
  return tokens;
};
```

### 6.4 Rate Limiting & DDoS Protection

```typescript
// middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Rate limit geral
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:general:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: {
    error: 'Muitas requisições. Tente novamente mais tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit para auth (mais restritivo)
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentativas de login
  skipSuccessfulRequests: true, // Reset após sucesso
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  }
});

// Rate limit específico para transações
export const transactionLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:tx:'
  }),
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 transações por minuto
  keyGenerator: (req) => req.user!.id // Por usuário, não IP
});
```

### 6.5 Validação de Dados

```typescript
// validators/transaction.validator.ts
import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  description: z.string().min(1).max(255),
  amount: z.number().positive().max(999999999.99),
  transactionDate: z.string().datetime(),
  categoryId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    address: z.string().max(500)
  }).optional()
}).refine(
  (data) => {
    // Validação adicional: data não pode ser futura além de 1 dia
    const transactionDate = new Date(data.transactionDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return transactionDate <= tomorrow;
  },
  { message: 'Data da transação não pode ser no futuro', path: ['transactionDate'] }
);

// Sanitização para prevenir XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
```

### 6.6 Auditoria & Compliance

#### Audit Logging
```typescript
// middleware/audit.middleware.ts
export const auditMiddleware = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Capturar dados antes da operação
    const oldData = await captureEntityState(req, action);
    
    res.on('finish', async () => {
      const duration = Date.now() - startTime;
      
      // Só logar operações bem-sucedidas que modificam dados
      if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        await prisma.auditLog.create({
          data: {
            userId: req.user?.id,
            workspaceId: req.workspace?.id,
            action,
            entityType: getEntityType(req),
            entityId: req.params.id,
            oldData,
            newData: req.body,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            metadata: {
              duration,
              statusCode: res.statusCode
            }
          }
        });
      }
    });
    
    next();
  };
};
```

#### LGPD/GDPR Compliance
```typescript
// services/compliance.service.ts
export class ComplianceService {
  // Exportar dados do usuário (direito à portabilidade)
  async exportUserData(userId: string) {
    const data = await prisma.$queryRaw`
      SELECT * FROM users WHERE id = ${userId}
      UNION ALL
      SELECT * FROM transactions WHERE user_id = ${userId}
      -- ... todas as tabelas
    `;
    
    // Criptografar arquivo de exportação
    const encrypted = await encryptExport(data);
    
    return {
      fileUrl: await storeSecurely(encrypted),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }
  
  // Anonização de dados (exclusão de conta)
  async anonymizeUser(userId: string) {
    await prisma.$transaction([
      // Anonizar usuário
      prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@anon.fincontrol.io`,
          firstName: 'Deleted',
          lastName: 'User',
          phone: null,
          avatarUrl: null,
          deletedAt: new Date()
        }
      }),
      
      // Manter transações para integridade financeira, mas anonimizar descrições
      prisma.transaction.updateMany({
        where: { workspace: { members: { some: { userId } } } },
        data: {
          description: '[REDACTED]',
          notes: null,
          location: null,
          attachmentUrl: null
        }
      }),
      
      // Excluir dados pessoais
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.refreshToken.deleteMany({ where: { userId } })
    ]);
  }
  
  // Consent tracking
  async recordConsent(userId: string, purpose: string, granted: boolean) {
    await prisma.consentRecord.create({
      data: {
        userId,
        purpose,
        granted,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });
  }
}
```

### 6.7 Configurações de Segurança no Docker

```dockerfile
# Dockerfile.api (security hardening)
FROM node:20-alpine AS base

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copiar apenas arquivos necessários
COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production

COPY --chown=nodejs:nodejs dist ./dist

# Remover ferramentas de desenvolvimento
RUN apk del curl wget

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.security.yml
version: '3.8'

services:
  api:
    build:
      context: ./apps/api
n      dockerfile: Dockerfile
    read_only: true  # Sistema de arquivos somente leitura
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    networks:
      - backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    secrets:
      - jwt_access_secret
      - jwt_refresh_secret
      - field_encryption_key

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    command:
      - "postgres"
      - "-c"
      - "ssl=on"
      - "-c"
      - "ssl_cert_file=/etc/ssl/certs/server.crt"
      - "-c"
      - "ssl_key_file=/etc/ssl/private/server.key"

secrets:
  jwt_access_secret:
    external: true
  jwt_refresh_secret:
    external: true
  field_encryption_key:
    external: true
  db_password:
    external: true

networks:
  backend:
    internal: true  # Sem acesso externo
```

### 6.8 Checklist de Segurança Pré-Deploy

```markdown
## Security Checklist

### Autenticação & Autorização
- [ ] JWT com expiração curta (15 min) + refresh tokens
- [ ] bcrypt com cost factor ≥ 12
- [ ] 2FA disponível para usuários
- [ ] Rate limiting implementado
- [ ] Proteção contra brute force
- [ ] Session timeout configurado

### Criptografia
- [ ] TLS 1.3 em todos os endpoints
- [ ] Campos sensíveis criptografados (AES-256)
- [ ] Secrets em variáveis de ambiente / Docker secrets
- [ ] Nunca logar dados sensíveis
- [ ] Headers de segurança configurados

### Dados
- [ ] Validação de entrada em todos os endpoints
- [ ] SQL injection prevention (ORM parametrizado)
- [ ] XSS protection (output encoding)
- [ ] CSRF tokens para mutations
- [ ] File upload restrictions (tipo, tamanho, virus scan)

### Infraestrutura
- [ ] Containers rodando como non-root
- [ ] Read-only filesystem onde possível
- [ ] Resource limits configurados
- [ ] Network segmentation
- [ ] WAF configurado
- [ ] DDoS protection ativado

### Compliance
- [ ] Audit logging habilitado
- [ ] LGPD/GDPR compliance verificado
- [ ] Política de retenção de dados definida
- [ ] Procedimento de exclusão de conta implementado
- [ ] Consent tracking implementado
- [ ] DPO contact disponível

### Monitoramento
- [ ] Alertas de atividades suspeitas
- [ ] Logs centralizados
- [ ] SIEM integrado (se aplicável)
- [ ] Incident response plan documentado
```

---

## 7. Requisitos Não-Funcionais

### 7.1 Performance

| Métrica | Meta | Estratégia |
|---------|------|------------|
| Time to First Byte | < 200ms | Edge caching, CDN |
| First Contentful Paint | < 1.5s | Code splitting, lazy loading |
| API Response Time (p95) | < 300ms | Database indexing, caching |
| Dashboard Load | < 2s | Aggregate caching, pre-computed |
| Import 1000 transactions | < 30s | Async processing, batch inserts |

### 7.2 Escalabilidade

- **Horizontal Scaling:** Stateless API permite múltiplas instâncias
- **Database Read Replicas:** Para relatórios pesados
- **Redis Cluster:** Para sessões e cache distribuído
- **Queue Workers:** Processamento assíncrono de imports
- **Auto-scaling:** Baseado em CPU/memory/load

### 7.3 Disponibilidade

- **Target SLA:** 99.9% uptime
- **RPO (Recovery Point Objective):** 1 hora
- **RTO (Recovery Time Objective):** 4 horas
- **Backup Strategy:**
  - PostgreSQL: Daily full + WAL archiving
  - Redis: AOF persistence
  - Files: Versioned S3/MinIO

### 7.4 Monitoramento

```yaml
# Grafana dashboards recomendados
- Application Performance (latency, throughput, errors)
- Business Metrics (transactions/day, active users)
- Security Events (failed logins, rate limit hits)
- Database Performance (query times, connection pool)
- Infrastructure (CPU, memory, disk, network)
```

---

## 8. Decisões de Arquitetura (ADRs)

### ADR 001: PostgreSQL sobre MongoDB
**Status:** Aceito  
**Contexto:** Necessidade de ACID compliance para transações financeiras  
**Decisão:** PostgreSQL com Prisma ORM  
**Consequências:** Melhor integridade, queries complexas com window functions, schema migrations versionadas

### ADR 002: Redis para Cache e Sessions
**Status:** Aceito  
**Contexto:** Sessões precisam ser stateless e rápidas  
**Decisão:** Redis para sessions, rate limiting e cache  
**Consequências:** Escalabilidade horizontal, invalidação granular, alta performance

### ADR 003: Async Processing para Imports
**Status:** Aceito  
**Contexto:** Imports de extratos podem demorar e consumir muitos recursos  
**Decisão:** BullMQ para processamento assíncrono  
**Consequências:** UX responsiva, retry automático, paralelização

### ADR 004: Field-Level Encryption
**Status:** Aceito  
**Contexto:** Dados bancários são sensíveis e requerem proteção extra  
**Decisão:** Criptografia AES-256 para campos sensíveis  
**Consequências:** Segurança aumentada, complexidade de queries, necessidade de key management

---

## 9. Próximos Passos

1. **Fase 2: Design System** - Criar `design-system.md` completo (obrigatório)
2. **Fase 3: Setup** - Configurar Docker, CI/CD, ambiente de desenvolvimento
3. **Fase 4: MVP** - Implementar autenticação + CRUD de contas/transações
4. **Fase 5: Features** - Dashboard, relatórios, importação, metas
5. **Fase 6: Polish** - Testes, otimização, documentação

---

**Documento Versionado**  
Última atualização: 2026-02-16  
Autor: Arquiteto de Software FinControl
