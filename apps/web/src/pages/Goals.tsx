import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, Calendar, X, Wallet } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { goalService } from '../services/goalService';
import { Goal } from '../types';

const goalTypes = {
  SAVINGS: { label: 'Economia', color: 'text-emerald-400' },
  DEBT_PAYMENT: { label: 'Quitar Dívida', color: 'text-rose-400' },
  PURCHASE: { label: 'Compra', color: 'text-violet-400' },
  INVESTMENT: { label: 'Investimento', color: 'text-blue-400' },
  OTHER: { label: 'Outro', color: 'text-slate-400' }
};

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showContribute, setShowContribute] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
    type: 'SAVINGS' as const
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getAll();
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalService.create({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline || undefined
      });
      setShowModal(false);
      setFormData({ name: '', description: '', targetAmount: '', deadline: '', type: 'SAVINGS' as const });
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showContribute) return;
    try {
      await goalService.contribute(showContribute, parseFloat(contributeAmount));
      setShowContribute(null);
      setContributeAmount('');
      fetchGoals();
    } catch (error) {
      console.error('Error contributing:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;
    try {
      await goalService.delete(id);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Metas Financeiras</h1>
            <p className="text-slate-400 mt-1">Defina e acompanhe suas metas de economia</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-lg
                     hover:bg-violet-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Meta
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30">
            <p className="text-emerald-400 text-sm">Total Economizado</p>
            <p className="text-2xl font-bold text-white mt-1">R$ {totalSaved.toFixed(2)}</p>
          </div>
          <div className="bg-violet-500/10 rounded-2xl p-6 border border-violet-500/30">
            <p className="text-violet-400 text-sm">Meta Total</p>
            <p className="text-2xl font-bold text-white mt-1">R$ {totalTarget.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <p className="text-slate-400 text-sm">Progresso</p>
            <p className="text-2xl font-bold text-white mt-1">
              {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-700/30">
            <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Nenhuma meta</h3>
            <p className="text-slate-500 mb-6">Crie metas para economizar com mais foco</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
            >
              Criar Meta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const typeConfig = goalTypes[goal.type] || goalTypes.OTHER;
              const remaining = goal.targetAmount - goal.currentAmount;

              return (
                <div key={goal.id} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Target className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                        <span className={`text-sm ${typeConfig.color}`}>{typeConfig.label}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setShowContribute(goal.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                        title="Adicionar valor"
                      >
                        <Wallet className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-slate-400 text-sm mb-4">{goal.description}</p>
                  )}

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">
                      R$ {goal.currentAmount.toFixed(2)}
                    </span>
                    <span className="text-slate-400">/ R$ {goal.targetAmount.toFixed(2)}</span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{percentage.toFixed(1)}% completo</span>
                    {remaining > 0 && (
                      <span className="text-sm text-slate-500">
                        Faltam R$ {remaining.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {goal.deadline && (
                    <p className="mt-3 text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Nova Meta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Viagem para Europa"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes da meta..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Valor Alvo *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prazo</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowContribute(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Adicionar Valor</h2>
            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Valor *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContribute(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}


export default Goals;
