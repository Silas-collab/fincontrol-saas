import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, PiggyBank, AlertCircle, CheckCircle2, X, TrendingUp } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { Budget, Category } from '../types';

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'monthly' as const,
    categoryId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetRes, catRes] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll()
      ]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data.filter(c => c.type === 'expense'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        endDate: formData.endDate || undefined
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.id, data);
      } else {
        await budgetService.create(data);
      }

      setShowModal(false);
      setEditingBudget(null);
      setFormData({
        name: '',
        amount: '',
        period: 'monthly' as const,
        categoryId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) return;
    try {
      await budgetService.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return { label: 'Estourado', color: 'text-rose-400', bg: 'bg-rose-500/10' };
    if (percentage >= 80) return { label: 'Alerta', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'Dentro do Orçamento', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Orçamentos</h1>
            <p className="text-slate-400 mt-1">Controle seus gastos com orçamentos mensais</p>
          </div>
          <button
            onClick={() => {
              setEditingBudget(null);
              setFormData({
                name: '',
                amount: '',
                period: 'monthly' as const,
                categoryId: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-lg
                     hover:bg-violet-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-700/30">
            <PiggyBank className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Nenhum orçamento</h3>
            <p className="text-slate-500 mb-6">Crie seu primeiro orçamento para controlar gastos</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
            >
              Criar Orçamento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map((budget) => {
              const category = categories.find(c => c.id === budget.categoryId);
              const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
              const status = getStatus(budget);
              const remaining = budget.amount - budget.spent;

              return (
                <div key={budget.id} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{budget.name}</h3>
                      {category && (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-1"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {/* TODO: Edit */}}
                        className="p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">
                      R$ {budget.spent.toFixed(2)}
                    </span>
                    <span className="text-slate-400">
                      / R$ {budget.amount.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        percentage >= 100 ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${status.color}`}>
                      {percentage.toFixed(1)}% utilizado
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {remaining > 0 && (
                    <p className="mt-3 text-sm text-emerald-400">
                      R$ {remaining.toFixed(2)} restantes
                    </p>
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
            <h2 className="text-xl font-bold text-white mb-6">Novo Orçamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Alimentação"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Valor Limite *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Todas as despesas</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
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
    </Layout>
  );
}


export default Budgets;
