import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useAccounts } from '../hooks/useAccounts';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  LogOut,
  Plus,
  DollarSign,
  CreditCard,
  PiggyBank,
  Target,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { summary, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const [showAddAccount, setShowAddAccount] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isLoading = dashboardLoading || accountsLoading;
  const error = dashboardError || accountsError;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                FinControl
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-400">
                <span className="text-sm">Olá,</span>
                <span className="text-white font-medium">{user?.firstName || 'Usuário'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Balance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-400" />
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    Total
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">Saldo Total</p>
                <p className="text-2xl font-bold text-white">
                  R$ {(summary?.totalBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>

              {/* Monthly Income */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-green-400" />
                  </div>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                    Este mês
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">Receitas</p>
                <p className="text-2xl font-bold text-green-400">
                  R$ {(summary?.monthlyIncome || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>

              {/* Monthly Expense */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <ArrowDownRight className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                    Este mês
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">Despesas</p>
                <p className="text-2xl font-bold text-red-400">
                  R$ {(summary?.monthlyExpense || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>

              {/* Net Worth */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                    Patrimônio
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">Patrimônio Líquido</p>
                <p className="text-2xl font-bold text-purple-400">
                  R$ {(summary?.netWorth || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </motion.div>
            </div>

            {/* Accounts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Accounts List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold">Minhas Contas</h2>
                  </div>
                  <button
                    onClick={() => setShowAddAccount(!showAddAccount)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>

                {showAddAccount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-4 bg-slate-800/50 rounded-xl"
                  >
                    <p className="text-sm text-slate-400">Formulário de adicionar conta (implementar)</p>
                  </motion.div>
                )}

                {accounts.length === 0 ? (
                  <div className="text-center py-12">
                    <PiggyBank className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nenhuma conta cadastrada</p>
                    <p className="text-slate-500 text-sm mt-1">Adicione sua primeira conta para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accounts.map((account: any) => (
                      <motion.div
                        key={account.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: account.color ? account.color + '20' : '#10b98120' }}
                          >
                            <Wallet
                              className="h-6 w-6"
                              style={{ color: account.color || '#10b981' }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{account.name}</p>
                            <p className="text-sm text-slate-400 capitalize">{account.type.toLowerCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            R$ {parseFloat(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-slate-400">{account.currency || 'BRL'}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold">Ações Rápidas</h2>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <ArrowUpRight className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Nova Receita</p>
                        <p className="text-xs text-slate-400">Registrar entrada</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Nova Despesa</p>
                        <p className="text-xs text-slate-400">Registrar saída</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors text-left">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Transferência</p>
                        <p className="text-xs text-slate-400">Entre contas</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30 p-6">
                  <h3 className="font-semibold text-emerald-400 mb-2">💡 Dica do Dia</h3>
                  <p className="text-sm text-slate-300">
                    Mantenha suas finanças organizadas categorizando cada transação. Isso ajuda a identificar onde seu dinheiro está indo!
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
