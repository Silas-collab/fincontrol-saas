import { useState, useEffect } from 'react';
import { X, ArrowRightLeft, DollarSign, Calendar, FileText, Wallet } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { accountService } from '../../services/accountService';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransferModal({ isOpen, onClose, onSuccess }: TransferModalProps) {
  // @ts-ignore - usando fetchAccounts em vez de refresh
  const { accounts, refresh: refreshAccounts } = useAccounts();

  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    fromAccountId: '',
    toAccountId: '',
    description: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      refreshAccounts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (accounts.length >= 2) {
      setFormData(prev => ({
        ...prev,
        fromAccountId: accounts[0].id,
        toAccountId: accounts[1].id
      }));
    } else if (accounts.length === 1) {
      setFormData(prev => ({ ...prev, fromAccountId: accounts[0].id }));
    }
  }, [accounts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor inválido');
      }

      if (formData.fromAccountId === formData.toAccountId) {
        throw new Error('As contas de origem e destino devem ser diferentes');
      }

      await accountService.transfer({
        amount: amount,
        date: formData.date,
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.toAccountId,
        description: formData.description || 'Transferência',
        notes: formData.notes
      });

      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        fromAccountId: accounts[0]?.id || '',
        toAccountId: accounts[1]?.id || '',
        description: '',
        notes: ''
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erro ao realizar transferência');
    } finally {
      setLoading(false);
    }
  };

  const fromAccount = accounts.find(a => a.id === formData.fromAccountId);
  const toAccount = accounts.find(a => a.id === formData.toAccountId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Transferência</h2>
                <p className="text-sm text-slate-400">Movimente dinheiro entre contas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* Accounts Selection */}
          <div className="grid grid-cols-2 gap-4">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                De (Origem) *
              </label>
              <select
                required
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                         text-white appearance-none
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Selecione</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              {fromAccount && (
                <p className="mt-1 text-xs text-slate-500">
                  Saldo: R$ {fromAccount.balance.toFixed(2)}
                </p>
              )}
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Para (Destino) *
              </label>
              <select
                required
                value={formData.toAccountId}
                onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                         text-white appearance-none
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Selecione</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              {toAccount && (
                <p className="mt-1 text-xs text-slate-500">
                  Saldo: R$ {toAccount.balance.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-violet-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-lg font-semibold placeholder-slate-500
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Data *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                         text-white placeholder-slate-500
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descrição *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Transferência mensal"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                         text-white placeholder-slate-500
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Detalhes adicionais..."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                       text-white placeholder-slate-500 resize-none
                       focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300
                       hover:bg-slate-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || accounts.length < 2}
              className="flex-1 px-4 py-2.5 rounded-lg bg-violet-500 text-white
                       hover:bg-violet-600 transition-colors font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4" />
                  Transferir
                </>
              )}
            </button>
          </div>

          {accounts.length < 2 && (
            <p className="text-center text-sm text-amber-400">
              Você precisa de pelo menos 2 contas para fazer transferências.
              <a href="/accounts" className="underline ml-1">Criar conta</a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
