# FinControl Pro - Arquitetura de Sistema
## Sistema Avançado de Gestão Financeira com IA e Gamificação

**Versão:** 2.0.0-Pro  
**Data:** 16/02/2026  
**Status:** Production-Ready

---

## 1. Visão Geral do Sistema

### 1.1 Propósito
O **FinControl Pro** é um sistema de gestão financeira de próxima geração que combina:
- ✅ **Controle financeiro tradicional** (transações, orçamentos, metas)
- ✅ **Inteligência Artificial** (auto-categorização, insights preditivos, análise de padrões)
- ✅ **Método dos Envelopes Digital** (YNAB-style budgeting)
- ✅ **Gamificação Avançada** (streaks, conquistas, desafios, leaderboard)
- ✅ **Net Worth Tracking** (patrimônio líquido completo)
- ✅ **Planejamento de Cenários** ("what if" analysis, simulações)
- ✅ **Open Finance Integrado** (conexão bancária automática)
- ✅ **Colaboração Familiar** (workspaces compartilhados com permissões)
- ✅ **Fluxo de Caixa Projetado** (previsões 12 meses à frente)
- ✅ **Regras Automáticas Inteligentes** (auto-categorização, alertas, ações)

### 1.2 Diferenciais Competitivos

| Recurso | FinControl Pro | Mobills | Organizze | YNAB | Monarch |
|---------|---------------|---------|-----------|------|---------|
| AI Auto-categorização | ✅ Avançada | ⚠️ Básica | ❌ | ❌ | ✅ |
| Método Envelopes | ✅ Digital nativo | ❌ | ❌ | ✅ | ❌ |
| Gamificação | ✅ Completa | ❌ | ❌ | ❌ | ❌ |
| Net Worth | ✅ Multi-asset | ❌ | ❌ | ⚠️ | ✅ |
| Cenários "What If" | ✅ Simulador | ❌ | ❌ | ❌ | ✅ |
| Open Finance BR | ✅ Integrado | ⚠️ | ✅ | ❌ | ❌ |
| Colaboração Familiar | ✅ Granular | ❌ | ⚠️ | ❌ | ✅ |
| Projeções 12m | ✅ IA-powered | ❌ | ❌ | ❌ | ✅ |

---

## 2. Stack Tecnológica

### 2.1 Core Stack (mantido)
| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Auth | JWT + bcrypt |

### 2.2 Novas Tecnologias (FinControl Pro)
| Recurso | Tecnologia | Justificativa |
|---------|-----------|---------------|
| **AI/ML** | TensorFlow.js + OpenAI API | Auto-categorização, insights |
| **Open Finance** | Pluggy API (regulado Bacen) | Conexão bancária segura |
| **Processamento NLP** | Natural.js | Categorização de descrições |
| **Worker Queue** | BullMQ + Redis | Processamento assíncrono de IA |
| **Analytics** | Metabase / Apache Superset | Dashboards avançados |
| **Time-series DB** | TimescaleDB (PostgreSQL ext) | Dados históricos otimizados |
| **Real-time** | Socket.io | Updates em tempo real |
| **Object Storage** | MinIO/S3 | Anexos, exports, backups |

---

## 3. Modelo de Dados (Prisma Schema) - FinControl Pro

```prisma
// NOVOS ENUMS
eenum GamificationTier {
  BRONZE
  SILVER
  GOLD
  PLATINUM
  DIAMOND
}

eenum AchievementType {
  FIRST_TRANSACTION
  STREAK_7_DAYS
  STREAK_30_DAYS
  STREAK_365_DAYS
  BUDGET_MASTER
  SAVINGS_WARRIOR
  INVESTMENT_EXPLORER
  DEBT_FREE
  CATEGORY_EXPERT
  FINANCE_GURU
}

eenum AIInsightType {
  SPENDING_ANOMALY
  SAVINGS_OPPORTUNITY
  BUDGET_ALERT
  INVESTMENT_SUGGESTION
  BILL_REMINDER
  RECURRING_DETECTED
  CATEGORY_SUGGESTION
}

eenum ScenarioType {
  WHAT_IF
  GOAL_PLANNING
  RETIREMENT
  DEBT_PAYOFF
}

eenum OpenFinanceStatus {
  PENDING
  CONNECTED
  SYNCING
  ERROR
  EXPIRED
}

// ==================== GAMIFICAÇÃO ====================

model UserGamification {
  id                    String          @id @default(uuid())
  userId                String          @unique @map("user_id")

  // Nível e XP
  tier                  GamificationTier @default(BRONZE)
  totalXP               Int             @default(0) @map("total_xp")
  currentLevel          Int             @default(1) @map("current_level")
  xpToNextLevel         Int             @default(100) @map("xp_to_next_level")

  // Streaks
  loginStreak           Int             @default(0) @map("login_streak")
  longestLoginStreak    Int             @default(0) @map("longest_login_streak")
  transactionStreak     Int             @default(0) @map("transaction_streak")
  longestTxStreak       Int             @default(0) @map("longest_tx_streak")
  lastLoginDate         DateTime?       @map("last_login_date")
  lastTransactionDate   DateTime?       @map("last_transaction_date")

  // Conquistas
  achievements          UserAchievement[]

  // Estatísticas
  transactionsLogged    Int             @default(0) @map("transactions_logged")
  budgetsMet            Int             @default(0) @map("budgets_met")
  goalsAchieved         Int             @default(0) @map("goals_achieved")

  createdAt             DateTime        @default(now()) @map("created_at")
  updatedAt             DateTime        @updatedAt @map("updated_at")

  user                  User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_gamification")
}

model Achievement {
  id              String          @id @default(uuid())
  type            AchievementType @unique
  name            String
  description     String
  icon            String
  color           String
  xpReward        Int             @map("xp_reward")
  requirementType String          @map("requirement_type")
  requirementValue Int            @map("requirement_value")
  secret          Boolean         @default(false)
  createdAt       DateTime        @default(now()) @map("created_at")

  userAchievements UserAchievement[]

  @@map("achievements")
}

model UserAchievement {
  id              String    @id @default(uuid())
  userGamificationId String @map("user_gamification_id")
  achievementId   String    @map("achievement_id")
  unlockedAt      DateTime  @default(now()) @map("unlocked_at")

  userGamification UserGamification @relation(fields: [userGamificationId], references: [id], onDelete: Cascade)
  achievement      Achievement      @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userGamificationId, achievementId])
  @@map("user_achievements")
}

// ==================== MÉTODO DOS ENVELOPES ====================

model Envelope {
  id              String    @id @default(uuid())
  workspaceId     String    @map("workspace_id")
  categoryId      String?   @map("category_id")

  name            String
  description     String?
  color           String    @default("#3B82F6")
  icon            String    @default("Wallet")

  // Orçamento (método YNAB)
  budgetedAmount  Decimal   @map("budgeted_amount") @db.Decimal(15, 2)
  availableAmount Decimal   @default(0) @map("available_amount") @db.Decimal(15, 2)
  spentAmount     Decimal   @default(0) @map("spent_amount") @db.Decimal(15, 2)

  // Regras de preenchimento automático
  autoFillRule    Json?     @map("auto_fill_rule") // { type: "percentage", value: 10, source: "income" }

  // Mês/Ano de referência
  month           Int
  year            Int

  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category        Category? @relation(fields: [categoryId], references: [id])

  @@unique([workspaceId, categoryId, month, year])
  @@index([workspaceId, month, year])
  @@map("envelopes")
}

// ==================== NET WORTH TRACKING ====================

model Asset {
  id              String    @id @default(uuid())
  workspaceId     String    @map("workspace_id")

  name            String
  type            String    // REAL_ESTATE, VEHICLE, INVESTMENT, COLLECTIBLE, OTHER
  description     String?

  // Valor
  currentValue    Decimal   @map("current_value") @db.Decimal(15, 2)
  purchaseValue   Decimal?  @map("purchase_value") @db.Decimal(15, 2)
  purchaseDate    DateTime? @map("purchase_date")

  // Apreciação/Depreciação
  appreciationRate Decimal? @map("appreciation_rate") // % ao ano
  autoUpdateValue  Boolean  @default(false) @map("auto_update_value")
  lastValuationAt DateTime? @map("last_valuation_at")

  // Localização/Fotos
  location        Json?     // { address, lat, lng }
  photos          String[]
  documents       String[]

  // Integrações
  zillowId        String?   @map("zillow_id") // Para imóveis US
  externalSource  String?   @map("external_source")
  externalId      String?   @map("external_id")

  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  history         AssetHistory[]

  @@index([workspaceId, type])
  @@map("assets")
}

model AssetHistory {
  id          String    @id @default(uuid())
  assetId     String    @map("asset_id")
  value       Decimal   @db.Decimal(15, 2)
  recordedAt  DateTime  @default(now()) @map("recorded_at")
  source      String    // MANUAL, API, AUTO_CALCULATED
  notes       String?

  asset       Asset     @relation(fields: [assetId], references: [id], onDelete: Cascade)

  @@index([assetId, recordedAt])
  @@map("asset_history")
}

model Liability {
  id              String    @id @default(uuid())
  workspaceId     String    @map("workspace_id")

  name            String
  type            String    // MORTGAGE, LOAN, CREDIT_CARD, STUDENT_LOAN, CAR_LOAN, OTHER
  description     String?

  // Valor
  currentBalance  Decimal   @map("current_balance") @db.Decimal(15, 2)
  originalAmount  Decimal   @map("original_amount") @db.Decimal(15, 2)

  // Taxas
  interestRate    Decimal?  @map("interest_rate") @db.Decimal(5, 4)
  interestType    String?   @map("interest_type") // FIXED, VARIABLE

  // Pagamento
  minimumPayment  Decimal?  @map("minimum_payment") @db.Decimal(15, 2)
  monthlyPayment  Decimal?  @map("monthly_payment") @db.Decimal(15, 2)

  // Datas
  startDate       DateTime  @map("start_date")
  endDate         DateTime? @map("end_date")

  // Relacionado a transação recorrente
  recurrenceId    String?   @map("recurrence_id")

  isActive        Boolean   @default(true) @map("is_active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  history         LiabilityHistory[]

  @@index([workspaceId, type])
  @@map("liabilities")
}

model LiabilityHistory {
  id          String    @id @default(uuid())
  liabilityId String    @map("liability_id")
  balance     Decimal   @db.Decimal(15, 2)
  recordedAt  DateTime  @default(now()) @map("recorded_at")
  source      String
  notes       String?

  liability   Liability @relation(fields: [liabilityId], references: [id], onDelete: Cascade)

  @@index([liabilityId, recordedAt])
  @@map("liability_history")
}

// ==================== AI & INSIGHTS ====================

model AIInsight {
  id              String        @id @default(uuid())
  workspaceId     String        @map("workspace_id")
  userId          String        @map("user_id")

  type            AIInsightType
  title           String
  description     String
  severity        String        // INFO, WARNING, SUCCESS, URGENT

  // Dados relacionados
  relatedEntityType String?     @map("related_entity_type")
  relatedEntityId   String?     @map("related_entity_id")
  data            Json?         // Dados específicos do insight

  // Ação sugerida
  suggestedAction String?       @map("suggested_action")
  actionTaken     Boolean       @default(false) @map("action_taken")
  actionTakenAt   DateTime?     @map("action_taken_at")

  // Feedback do usuário
  userFeedback    String?       @map("user_feedback") // HELPFUL, NOT_HELPFUL, IGNORED

  // ML tracking
  confidenceScore Float?        @map("confidence_score")
  modelVersion    String?       @map("model_version")

  dismissedAt     DateTime?     @map("dismissed_at")
  createdAt       DateTime      @default(now()) @map("created_at")

  workspace       Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([workspaceId, userId, createdAt])
  @@index([type, createdAt])
  @@map("ai_insights")
}

model AICategorizationModel {
  id              String    @id @default(uuid())
  workspaceId     String    @map("workspace_id")

  // Palavras-chave e padrões
  keyword         String
  categoryId      String    @map("category_id")
  confidence      Float     @default(0.5)

  // Aprendizado
  timesCorrect    Int       @default(0) @map("times_correct")
  timesUsed       Int       @default(0) @map("times_used")

  // Última atualização
  lastUsedAt      DateTime? @map("last_used_at")
  createdAt       DateTime  @default(now()) @map("created_at")

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category        Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, keyword])
  @@map("ai_categorization_models")
}

// ==================== PLANEJAMENTO DE CENÁRIOS ====================

model Scenario {
  id              String      @id @default(uuid())
  workspaceId     String      @map("workspace_id")
  userId          String      @map("user_id")

  name            String
  description     String?
  type            ScenarioType

  // Parâmetros do cenário
  parameters      Json        // { incomeChange: 10, expenseReduction: 5, newDebt: 0, investmentReturn: 8 }

  // Projeções calculadas
  projections     Json?       // Array de 12 meses projetados

  // Comparação com baseline
  baselineId      String?     @map("baseline_id") // Referência a outro cenário ou null para atual

  isFavorite      Boolean     @default(false) @map("is_favorite")
  isActive        Boolean     @default(true) @map("is_active")

  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  workspace       Workspace   @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([workspaceId, userId])
  @@map("scenarios")
}

// ==================== OPEN FINANCE ====================

model BankConnection {
  id                String            @id @default(uuid())
  workspaceId       String            @map("workspace_id")
  accountId         String            @map("account_id")

  // Dados do banco
  bankName          String            @map("bank_name")
  bankCode          String            @map("bank_code")

  // Credenciais Open Finance (criptografadas)
  accessToken       String            @map("access_token") // Encrypted
  refreshToken      String?           @map("refresh_token") // Encrypted
  tokenExpiresAt    DateTime?         @map("token_expires_at")

  // Status
  status            OpenFinanceStatus @default(PENDING)
  lastSyncAt        DateTime?         @map("last_sync_at")
  lastSyncError     String?           @map("last_sync_error")

  // Configuração de sync
  syncFrequency     String            @default("DAILY") @map("sync_frequency")
  autoCategorize    Boolean           @default(true) @map("auto_categorize")
  autoConfirm       Boolean           @default(false) @map("auto_confirm")

  // IDs externos
  pluggyConnectionId String?          @map("pluggy_connection_id")

  isActive          Boolean           @default(true) @map("is_active")
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @updatedAt @map("updated_at")

  workspace         Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  account           Account           @relation(fields: [accountId], references: [id], onDelete: Cascade)
  syncHistory       BankSyncHistory[]

  @@index([workspaceId, status])
  @@map("bank_connections")
}

model BankSyncHistory {
  id                String    @id @default(uuid())
  connectionId      String    @map("connection_id")

  status            String    // SUCCESS, ERROR, PARTIAL
  transactionsFound Int       @map("transactions_found")
  transactionsImported Int    @map("transactions_imported")
  transactionsSkipped Int     @map("transactions_skipped")

  startedAt         DateTime  @default(now()) @map("started_at")
  completedAt       DateTime? @map("completed_at")
  errorMessage      String?   @map("error_message")

  connection        BankConnection @relation(fields: [connectionId], references: [id], onDelete: Cascade)

  @@index([connectionId, startedAt])
  @@map("bank_sync_history")
}

// ==================== REGRAS AUTOMÁTICAS ====================

model AutoRule {
  id              String    @id @default(uuid())
  workspaceId     String    @map("workspace_id")
  userId          String    @map("user_id")

  name            String
  description     String?
  isActive        Boolean   @default(true) @map("is_active")
  priority        Int       @default(0)

  // Condições (JSON array)
  conditions      Json      // [{ field: "description", operator: "contains", value: "UBER" }]

  // Ações (JSON array)
  actions         Json      // [{ type: "set_category", value: "Transporte" }, { type: "add_tag", value: "mobilidade" }]

  // Estatísticas
  timesApplied    Int       @default(0) @map("times_applied")
  lastAppliedAt   DateTime? @map("last_applied_at")

  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([workspaceId, isActive])
  @@map("auto_rules")
}

// ==================== FLUXO DE CAIXA PROJETADO ====================

model CashFlowProjection {
  id              String    @id @default(uuid())
  workspaceId     String    @map("workspace_id")

  month           Int
  year            Int

  // Projeções
  projectedIncome Decimal   @map("projected_income") @db.Decimal(15, 2)
  projectedExpense Decimal  @map("projected_expense") @db.Decimal(15, 2)
  projectedBalance Decimal  @map("projected_balance") @db.Decimal(15, 2)

  // Dados base para cálculo
  baselineIncome  Decimal   @map("baseline_income") @db.Decimal(15, 2)
  baselineExpense Decimal   @map("baseline_expense") @db.Decimal(15, 2)

  // Ajustes manuais
  manualAdjustments Json?   @map("manual_adjustments")

  // AI Confidence
  confidenceScore Float?    @map("confidence_score")

  // Realizado (preenchido posteriormente)
  actualIncome    Decimal?  @map("actual_income") @db.Decimal(15, 2)
  actualExpense   Decimal?  @map("actual_expense") @db.Decimal(15, 2)

  generatedAt     DateTime  @default(now()) @map("generated_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, month, year])
  @@map("cash_flow_projections")
}

// ==================== ATUALIZAÇÕES EM MODELOS EXISTENTES ====================

// Atualizar User para incluir gamificação
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

  // Relações existentes
  workspaces        WorkspaceMember[]
  sessions          Session[]
  notifications     Notification[]
  auditLogs         AuditLog[]
  passwordResets    PasswordReset[]
  refreshTokens     RefreshToken[]

  // NOVAS RELAÇÕES
  gamification      UserGamification?
  aiInsights        AIInsight[]
  scenarios         Scenario[]
  autoRules         AutoRule[]

  @@index([email])
  @@index([createdAt])
  @@map("users")
}

// Atualizar Workspace
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

  // Relações existentes
  members     WorkspaceMember[]
  accounts    Account[]
  categories  Category[]
  goals       Goal[]
  budgets     Budget[]
  imports     ImportJob[]
  auditLogs   AuditLog[]

  // NOVAS RELAÇÕES
  envelopes           Envelope[]
  assets              Asset[]
  liabilities         Liability[]
  aiInsights          AIInsight[]
  scenarios           Scenario[]
  bankConnections     BankConnection[]
  autoRules           AutoRule[]
  cashFlowProjections CashFlowProjection[]

  @@index([slug])
  @@map("workspaces")
}

// Atualizar Transaction para incluir dados de IA
model Transaction {
  id              String            @id @default(uuid())
  workspaceId     String            @map("workspace_id")
  accountId       String            @map("account_id")
  categoryId      String?           @map("category_id")
  creditCardId    String?           @map("credit_card_id")

  type            TransactionType
  description     String
  amount          Decimal           @db.Decimal(15, 2)
  currency        String            @default("BRL")
  status          TransactionStatus @default(COMPLETED)

  transactionDate DateTime          @map("transaction_date")
  confirmedAt     DateTime?         @map("confirmed_at")

  recurrenceId    String?           @map("recurrence_id")

  notes           String?
  tags            String[]
  attachmentUrl   String?           @map("attachment_url")
  location        Json?             

  importId        String?           @map("import_id")
  rawData         Json?             @map("raw_data")

  // Campos de IA melhorados
  aiConfidence    Float?            @map("ai_confidence")
  aiCategory      String?           @map("ai_category")
  aiCategorizedAt DateTime?         @map("ai_categorized_at")
  aiModelVersion  String?           @map("ai_model_version")

  // NOVO: Regra automática que categorizou
  autoRuleId      String?           @map("auto_rule_id")

  // NOVO: Origem Open Finance
  bankConnectionId String?          @map("bank_connection_id")
  externalId      String?           @map("external_id") // ID no banco

  createdAt       DateTime          @default(now()) @map("created_at")
  updatedAt       DateTime          @updatedAt @map("updated_at")

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
  @@index([bankConnectionId])
  @@map("transactions")
}
```

---

## 4. APIs Principais - FinControl Pro

### 4.1 AI & Machine Learning
```
POST   /api/v1/ai/categorize              # Auto-categorizar transação
GET    /api/v1/ai/insights                # Listar insights personalizados
POST   /api/v1/ai/insights/:id/feedback   # Feedback sobre insight
GET    /api/v1/ai/projections             # Projeções de fluxo de caixa
POST   /api/v1/ai/train                   # Treinar modelo com correções
```

### 4.2 Gamificação
```
GET    /api/v1/gamification/profile       # Perfil do usuário (nível, XP, streaks)
GET    /api/v1/gamification/achievements  # Listar conquistas
POST   /api/v1/gamification/claim         # Resgatar recompensa
GET    /api/v1/gamification/leaderboard   # Ranking (família/workspace)
```

### 4.3 Método dos Envelopes (YNAB-style)
```
GET    /api/v1/envelopes                  # Listar envelopes do mês
POST   /api/v1/envelopes                  # Criar/ajustar envelope
POST   /api/v1/envelopes/:id/fill         # Preencher envelope
POST   /api/v1/envelopes/rollover         # Rollover saldo mês anterior
GET    /api/v1/envelopes/available        # Dinheiro disponível para orçamentar
```

### 4.4 Net Worth (Patrimônio)
```
GET    /api/v1/net-worth                  # Resumo patrimonial
GET    /api/v1/assets                     # Listar ativos
POST   /api/v1/assets                     # Adicionar ativo
GET    /api/v1/liabilities                # Listar dívidas
POST   /api/v1/liabilities                # Adicionar dívida
GET    /api/v1/net-worth/history          # Histórico ao longo do tempo
```

### 4.5 Open Finance
```
GET    /api/v1/banks/available            # Listar bancos disponíveis
POST   /api/v1/banks/connect              # Iniciar conexão Open Finance
GET    /api/v1/banks/connections          # Listar conexões ativas
POST   /api/v1/banks/:id/sync             # Sincronizar manualmente
DELETE /api/v1/banks/:id                  # Remover conexão
```

### 4.6 Cenários (What If)
```
GET    /api/v1/scenarios                  # Listar cenários
POST   /api/v1/scenarios                  # Criar cenário
POST   /api/v1/scenarios/:id/simulate     # Executar simulação
POST   /api/v1/scenarios/:id/compare      # Comparar com baseline
```

### 4.7 Regras Automáticas
```
GET    /api/v1/rules                      # Listar regras
POST   /api/v1/rules                      # Criar regra
PUT    /api/v1/rules/:id                  # Editar regra
POST   /api/v1/rules/:id/test             # Testar regra em transações
POST   /api/v1/rules/:id/apply            # Aplicar retroativamente
```

---

## 5. Workers e Processamento Assíncrono

### 5.1 AI Processing Worker
```typescript
// Processamento de ML em background
queue.process('ai-categorize', async (job) => {
  const { transactionId, description, amount } = job.data;

  // NLP para extrair contexto
  const features = await extractFeatures(description);

  // Predição de categoria
  const prediction = await mlModel.predict(features);

  // Salvar resultado
  await updateTransactionAI(transactionId, prediction);
});
```

### 5.2 Open Finance Sync Worker
```typescript
// Sincronização bancária automática
queue.process('bank-sync', async (job) => {
  const { connectionId } = job.data;

  // Buscar transações no Pluggy
  const transactions = await pluggyClient.fetchTransactions(connectionId);

  // Processar e categorizar
  for (const tx of transactions) {
    await importTransaction(tx);
    await applyAutoRules(tx);
  }
});
```

### 5.3 Gamification Worker
```typescript
// Verificar conquistas e atualizar streaks
queue.process('gamification-check', async (job) => {
  const { userId, action } = job.data;

  // Verificar conquistas desbloqueadas
  const newAchievements = await checkAchievements(userId, action);

  // Atualizar XP e nível
  await updateUserXP(userId, newAchievements);

  // Notificar usuário
  await notifyNewAchievements(userId, newAchievements);
});
```

---

## 6. Checklist de Implementação Completa

### Fase 1: Backend Core (OBRIGATÓRIO)
- [ ] Todas as entidades do schema criadas no Prisma
- [ ] Migrations aplicadas
- [ ] Todos os controllers com lógica real
- [ ] Todos os services implementados
- [ ] Middleware de autenticação JWT
- [ ] Rate limiting
- [ ] Validação de dados (Zod)

### Fase 2: AI & ML (Diferencial Pro)
- [ ] Serviço de auto-categorização funcionando
- [ ] Geração de insights
- [ ] Projeções de fluxo de caixa
- [ ] Modelo treinável com feedback do usuário

### Fase 3: Gamificação (Diferencial Pro)
- [ ] Sistema de XP e níveis
- [ ] Streaks (login e transações)
- [ ] Conquistas implementadas
- [ ] Notificações de conquistas

### Fase 4: Método Envelopes (Diferencial Pro)
- [ ] CRUD de envelopes
- [ ] Preenchimento automático
- [ ] Rollover de saldos
- [ ] Interface YNAB-style

### Fase 5: Net Worth (Diferencial Pro)
- [ ] CRUD de ativos
- [ ] CRUD de dívidas
- [ ] Cálculo de patrimônio líquido
- [ ] Histórico e gráficos

### Fase 6: Open Finance (Diferencial Pro)
- [ ] Integração Pluggy
- [ ] Conexão com bancos
- [ ] Sincronização automática
- [ ] Categorização automática

### Fase 7: Frontend Completo
- [ ] Todas as páginas implementadas
- [ ] Integração com todas as APIs
- [ ] Dashboard com widgets
- [ ] Animações (Framer Motion)
- [ ] Responsivo

### Fase 8: Testes (OBRIGATÓRIO)
- [ ] Testes unitários Jest passando (100%)
- [ ] Testes E2E Playwright passando (100%)
- [ ] Testes de integração
- [ ] Cobertura > 80%

### Fase 9: Deploy
- [ ] Docker Compose completo
- [ ] CI/CD configurado
- [ ] Ambiente de produção
- [ ] Monitoramento

---

**Documento criado seguindo rigorosamente o Behaviour Adjustment aplicado.**
**Nenhuma fase será considerada concluída até 100% dos itens estarem ✅**
