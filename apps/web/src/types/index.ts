export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CREDIT' | 'OTHER';
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  description?: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  accountId: string;
  categoryId?: string;
  category?: Category;
  account?: Account;
  notes?: string;
  isRecurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  categoryId?: string;
  category?: Category;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  type: 'SAVINGS' | 'DEBT_PAYMENT' | 'PURCHASE' | 'INVESTMENT' | 'OTHER';
  isActive: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  accounts: Account[];
  recentTransactions: Transaction[];
}
