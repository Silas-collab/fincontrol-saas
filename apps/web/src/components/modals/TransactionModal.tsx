import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, CreditCard, Wallet } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useCategories } from '../../hooks/useCategories';
import { transactionService } from '../../services/transactionService';
import { Account } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'INCOME' | 'EXPENSE';
  onSuccess?: () => void;
}

export function TransactionModal({ isOpen, onClose, type, onSuccess }: TransactionModalProps) {
  const { accounts, fetchAccounts } = useAccounts();
  const { categories, refresh } = useCategories();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    categoryId: '',
    notes: '',
    isRecurring: false,
    recurrenceType: 'monthly'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
      refresh();
    }
  }, [isOpen, fetchAccounts, refresh]);

  useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData(prev => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts, formData.accountId]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c: any) => c.type === type.toLowerCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor inválido');
      }

      await transactionService.create({
        description: formData.description,
        amount: amount,
        type: type,
        date: formData.date,
        accountId: formData.accountId,
        categoryId: formData.categoryId || undefined,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? (formData.recurrenceType as "daily" | "weekly" | "monthly" | "yearly") : undefined
      });

      // Reset form
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        accountId: accounts[0]?.id || '',
        categoryId: '',
        notes: '',
        isRecurring: false,
        recurrenceType: 'monthly'
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  const colors = type === 'INCOME'
    ? { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500/30' }
    : { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-400', border: 'border-rose-500/30' };

  const title = type === 'INCOME' ? 'Nova Receita' : 'Nova Despesa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className={`px-6 py-4 border-b ${colors.border} bg-gradient-to-r ${type === 'INCOME' ? 'from-emerald-500/10' : 'from-rose-500/10'} to-transparent`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-sm text-slate-400">Registre sua {type === 'INCOME' ? 'entrada' : 'saída'} de dinheiro</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Descrição *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" required value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={`Ex: ${type === 'INCOME' ? 'Salário' : 'Supermercado'}`}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Valor *</label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold ${colors.text}`}>R$</span>
              <input type="number" step="0.01" min="0.01" required value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-lg font-semibold placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Data *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="date" required value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Conta *</label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select required value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 appearance-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
                <option value="">Selecione uma conta</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.name} (R$ {account.balance.toFixed(2)})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 appearance-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
                <option value="">Sem categoria</option>
                {filteredCategories.map((category: any) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Observações</label>
            <textarea value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Detalhes adicionais..." rows={3}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <input type="checkbox" id="isRecurring" checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-0" />
            <div className="flex-1">
              <label htmlFor="isRecurring" className="text-sm font-medium text-slate-300 cursor-pointer">Transação Recorrente</label>
              <p className="text-xs text-slate-500 mt-0.5">Repetir automaticamente a cada período</p>
              {formData.isRecurring && (
                <select value={formData.recurrenceType}
                  onChange={(e) => setFormData({ ...formData, recurrenceType: e.target.value })}
                  className="mt-2 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-violet-500">
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                </select>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium">Cancelar</button>
            <button type="submit" disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-lg ${colors.bg} text-white ${colors.hover} transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><CreditCard className="w-4 h-4" />Salvar {type === 'INCOME' ? 'Receita' : 'Despesa'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
