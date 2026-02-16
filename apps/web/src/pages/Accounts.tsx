import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Wallet, PiggyBank, 
  CreditCard, TrendingUp, MoreHorizontal, X, Check,
  Building2, Landmark
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { accountService } from '../services/accountService';
import { Account } from '../types';

const accountTypes = {
  CHECKING: { label: 'Conta Corrente', icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  SAVINGS: { label: 'Poupança', icon: PiggyBank, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  INVESTMENT: { label: 'Investimento', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  CREDIT: { label: 'Cartão de Crédito', icon: CreditCard, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  OTHER: { label: 'Outro', icon: Landmark, color: 'text-slate-400', bg: 'bg-slate-500/10' }
};

export function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CHECKING',
    balance: '',
    description: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  // const navigate = useNavigate();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        balance: parseFloat(formData.balance) || 0
      };

      if (editingAccount) {
      // @ts-ignore
        await accountService.update(editingAccount.id, data);
      } else {
        await accountService.create(data as any);
      }

      setShowModal(false);
      setEditingAccount(null);
      setFormData({ name: '', type: 'CHECKING', balance: '', description: '' });
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      description: account.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await accountService.delete(id);
      setDeleteConfirm(null);
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Contas</h1>
            <p className="text-slate-400 mt-1">Gerencie suas contas bancárias e cartões</p>
          </div>
          <button
            onClick={() => {
              setEditingAccount(null);
              setFormData({ name: '', type: 'CHECKING', balance: '', description: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-lg
                     hover:bg-violet-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl p-6 
                        border border-violet-500/30">
            <p className="text-slate-400 text-sm">Saldo Total</p>
            <p className="text-3xl font-bold text-white mt-1">
              R$ {totalBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-sm">Total de Contas</p>
            <p className="text-3xl font-bold text-white mt-1">{accounts.length}</p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-sm">Tipos</p>
            <p className="text-3xl font-bold text-white mt-1">
              {new Set(accounts.map(a => a.type)).size}
            </p>
          </div>
        </div>

        {/* Accounts Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-700/30">
            <Wallet className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Nenhuma conta cadastrada</h3>
            <p className="text-slate-500 mb-6">Adicione sua primeira conta para começar</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
            >
              Adicionar Conta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => {
              const typeConfig = accountTypes[account.type] || accountTypes.OTHER;
              const Icon = typeConfig.icon;

              return (
                <div
                  key={account.id}
                  className="group bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50
                           hover:border-violet-500/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${typeConfig.bg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${typeConfig.color}`} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 rounded-lg text-slate-400 hover:text-violet-400 
                                 hover:bg-violet-500/10 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(account.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 
                                 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{account.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{typeConfig.label}</p>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      R$ {account.balance.toFixed(2)}
                    </span>
                  </div>

                  {account.description && (
                    <p className="mt-3 text-sm text-slate-500 line-clamp-2">{account.description}</p>
                  )}

                  {/* Delete Confirmation */}
                  {deleteConfirm === account.id && (
                    <div className="mt-4 p-3 bg-rose-500/10 rounded-lg border border-rose-500/30">
                      <p className="text-sm text-rose-400 mb-2">Tem certeza?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="flex-1 px-3 py-1.5 bg-rose-500 text-white text-sm rounded-lg
                                   hover:bg-rose-600 transition-colors"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg
                                   hover:bg-slate-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Conta Nubank"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                           text-white placeholder-slate-500
                           focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                           text-white appearance-none
                           focus:outline-none focus:border-violet-500"
                >
                  {Object.entries(accountTypes).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Saldo Inicial</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                             text-white placeholder-slate-500
                             focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                           text-white placeholder-slate-500 resize-none
                           focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300
                           hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-500 text-white
                           hover:bg-violet-600 transition-colors"
                >
                  {editingAccount ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}


export default Accounts;
