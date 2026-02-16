import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';

const presetColors = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

const presetIcons = ['shopping', 'food', 'transport', 'home', 'health', 'education', 'entertainment', 'salary', 'investment', 'other'];

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: presetColors[0],
    description: ''
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', type: 'expense', color: presetColors[0], description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Categorias</h1>
            <p className="text-slate-400 mt-1">Organize suas transações por categoria</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', type: 'expense', color: presetColors[0], description: '' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-500 text-white rounded-lg
                     hover:bg-violet-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nova Categoria
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Income Categories */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Categorias de Receita</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  {incomeCategories.length}
                </span>
              </div>

              <div className="space-y-3">
                {incomeCategories.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Nenhuma categoria de receita</p>
                ) : (
                  incomeCategories.map((category) => (
                    <CategoryCard 
                      key={category.id} 
                      category={category} 
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Expense Categories */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpCircle className="w-5 h-5 text-rose-400" />
                <h2 className="text-lg font-semibold text-white">Categorias de Despesa</h2>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs rounded-full">
                  {expenseCategories.length}
                </span>
              </div>

              <div className="space-y-3">
                {expenseCategories.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Nenhuma categoria de despesa</p>
                ) : (
                  expenseCategories.map((category) => (
                    <CategoryCard 
                      key={category.id} 
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>
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
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
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
                  placeholder="Ex: Alimentação"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' })}
                      className="w-4 h-4 text-emerald-500"
                    />
                    <span className="text-emerald-400">Receita</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' })}
                      className="w-4 h-4 text-rose-500"
                    />
                    <span className="text-rose-400">Despesa</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        formData.color === color ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
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
                  {editingCategory ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div 
      className="group flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50
               hover:border-slate-600 transition-all"
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <Tag className="w-5 h-5" style={{ color: category.color }} />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-white">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-slate-500">{category.description}</p>
        )}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(category)}
          className="p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


export default Categories;
