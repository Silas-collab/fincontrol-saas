import { motion } from 'framer-motion'
import { Plus, AlertCircle } from 'lucide-react'

const budgets = [
  { id: 1, name: 'Moradia', limit: 2000, spent: 1500, color: '#10b981' },
  { id: 2, name: 'Alimentação', limit: 800, spent: 680, color: '#3b82f6' },
  { id: 3, name: 'Transporte', limit: 500, spent: 350, color: '#f59e0b' },
  { id: 4, name: 'Lazer', limit: 400, spent: 420, color: '#ef4444' },
  { id: 5, name: 'Saúde', limit: 300, spent: 120, color: '#8b5cf6' },
]

export default function Budgets() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
          <p className="text-slate-400 mt-1">Controle seus gastos por categoria</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Novo Orçamento
        </button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.limit) * 100
          const isOverBudget = percentage > 100
          const isWarning = percentage > 80
          
          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{budget.name}</h3>
                {(isOverBudget || isWarning) && (
                  <AlertCircle className={`w-5 h-5 ${isOverBudget ? 'text-red-400' : 'text-amber-400'}`} />
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                    R$ {budget.spent.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm">de R$ {budget.limit.toLocaleString()}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: isOverBudget ? '#ef4444' : isWarning ? '#f59e0b' : budget.color 
                    }}
                  />
                </div>
                
                <p className={`text-sm mt-2 ${isOverBudget ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-slate-400'}`}>
                  {percentage.toFixed(0)}% utilizado
                  {isOverBudget && ' - Orçamento estourado!'}
                  {isWarning && !isOverBudget && ' - Atenção!'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
