import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Search, Filter, ArrowDownCircle, 
  ArrowUpCircle, Calendar, Wallet, Tag, X, ChevronLeft, ChevronRight,
  Download
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import { categoryService } from '../services/categoryService';
import { Transaction, Account, Category } from '../types';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    accountId: searchParams.get('account') || '',
    categoryId: searchParams.get('category') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    search: ''
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, accRes, catRes] = await Promise.all([
        transactionService.getAll({
          ...filters,
          page: pagination.page,
          limit: pagination.limit
        }),
        accountService.getAll(),
        categoryService.getAll()
      ]);

      setTransactions(transRes.data.data || []);
      setPagination(prev => ({ ...prev, total: transRes.data.total || 0 }));
      setAccounts(accRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;
    try {
      await transactionService.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Transações</h1>
            <p className="text-slate-400 mt-1">Gerencie todas as suas movimentações</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 
                       rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button
              onClick={() => {/* TODO: Export */}}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 
                       rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Receitas</span>
            </div>
            <p className="text-2xl font-bold text-white">
              R$ {totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-rose-500/10 rounded-2xl p-6 border border-rose-500/30">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpCircle className="w-5 h-5 text-rose-400" />
              <span className="text-rose-400 font-medium">Despesas</span>
            </div>
            <p className="text-2xl font-bold text-white">
              R$ {totalExpense.toFixed(2)}
            </p>
          </div>

          <div className={`rounded-2xl p-6 border ${
            totalIncome - totalExpense >= 0 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-rose-500/10 border-rose-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <Wallet className={`w-5 h-5 ${
                totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`} />
              <span className={`font-medium ${
                totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                Saldo do Período
              </span>
            </div>
            <p className={`text-2xl font-bold ${
              totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              R$ {(totalIncome - totalExpense).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Todos</option>
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Conta</label>
                <select
                  value={filters.accountId}
                  onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Todas</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Categoria</label>
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Todas</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Descrição..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-slate-400 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-slate-400 mb-1">Data Final</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-700/30">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Nenhuma transação</h3>
            <p className="text-slate-500">Adicione receitas ou despesas para começar</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Descrição</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Categoria</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Conta</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Valor</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'income' ? (
                            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ArrowUpCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className="text-sm text-white">{transaction.description}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {transaction.category ? (
                          <span 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                            style={{ 
                              backgroundColor: `${transaction.category.color}20`,
                              color: transaction.category.color 
                            }}
                          >
                            <Tag className="w-3 h-3" />
                            {transaction.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {transaction.account?.name || '-'}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} 
                        R$ {transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {/* TODO: Edit */}}
                            className="p-1.5 rounded text-slate-400 hover:text-violet-400 
                                     hover:bg-violet-500/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-400 
                                     hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-slate-300">
                    {pagination.page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page >= totalPages}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}


export default Transactions;
