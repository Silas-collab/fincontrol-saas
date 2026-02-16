export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member';
  user: User;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'wallet';
  balance: number;
  currency: string;
  color: string;
  workspaceId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  notes?: string;
  isRecurring: boolean;
  tags: string[];
  createdAt: string;
  category?: Category;
  account?: Account;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon: string;
  workspaceId: string;
  parentId?: string;
  budget?: number;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  categoryId: string;
  workspaceId: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  category?: Category;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  type: 'savings' | 'debt' | 'investment' | 'purchase';
  deadline?: string;
  workspaceId: string;
  accountId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
  savingsRate: number;
  transactionsCount: number;
  accountsCount: number;
  recentTransactions: Transaction[];
  expensesByCategory: { category: Category; amount: number }[];
  monthlyTrend: { month: string; income: number; expense: number }[];
}
