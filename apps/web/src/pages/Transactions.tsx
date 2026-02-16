import { motion } from 'framer-motion'
import { Plus, Search, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useState } from 'react'

const transactions = [
  { id: 1, description: 'Salário Janeiro', amount: 6500, type: 'income', date: '2026-01-05', category: 'Renda', account: 'Conta Corrente' },
  { id: 2, description: 'Aluguel', amount: -1500, type: 'expense', date: '2026-01-05', category: 'Moradia', account: 'Conta Corrente' },
  { id: 3, description: 'Supermercado', amount: -450, type: 'expense', date: '2026-01-08', category: 'Alimentação', account: 'Cartão Crédito' },
  { id: 4, description: 'Freelance Design', amount: 1200, type: 'income', date: '2026-01-10', category: 'Renda Extra', account: 'Conta Poupança' },
  { id: 5, description: 'Uber', amount: -35, type: 'expense', date: '2026-01-10', category: 'Transporte', account: 'Cartão Débito' },
  { id: 6, description: 'Netflix', amount: -39, type: 'expense', date: '2026-01-12', category: 'Lazer', account: 'Cartão Crédito' },
]

export default function Transactions() {
  const [search, setSearch] = useState('')
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transações</h1>
          <p className="text-slate-400 mt-1">Gerencie suas receitas e despesas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transações..."
            className="w-full pl-10 pr-4 py-2 bg-surface-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-700/50 hover:bg-surface-600/50 text-slate-300 rounded-lg text-sm transition-colors">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-700/50 hover:bg-surface-600/50 text-slate-300 rounded-lg text-sm transition-colors">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Descrição</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Categoria</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Conta</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Data</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                    </div>
                    <span className="text-white font-medium">{tx.description}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-300">{tx.category}</td>
                <td className="py-4 px-6 text-slate-300">{tx.account}</td>
                <td className="py-4 px-6 text-slate-400">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                <td className={`py-4 px-6 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
