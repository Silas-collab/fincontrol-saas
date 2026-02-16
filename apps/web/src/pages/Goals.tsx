import { motion } from 'framer-motion'
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react'

const goals = [
  { id: 1, name: 'Reserva de Emergência', target: 15000, current: 8000, deadline: '2026-12-31', type: 'savings' },
  { id: 2, name: 'Viagem Europa', target: 20000, current: 5500, deadline: '2026-07-15', type: 'purchase' },
  { id: 3, name: 'Quitar Dívida Carro', target: 25000, current: 12000, deadline: '2026-06-30', type: 'debt' },
  { id: 4, name: 'Investimentos Aposentadoria', target: 100000, current: 15000, deadline: '2046-01-01', type: 'investment' },
]

export default function Goals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Metas Financeiras</h1>
          <p className="text-slate-400 mt-1">Acompanhe seus objetivos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, index) => {
          const percentage = (goal.current / goal.target) * 100
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    {goal.type === 'savings' && <Target className="w-6 h-6 text-emerald-400" />}
                    {goal.type === 'purchase' && <Calendar className="w-6 h-6 text-emerald-400" />}
                    {goal.type === 'debt' && <TrendingUp className="w-6 h-6 text-emerald-400" />}
                    {goal.type === 'investment' && <TrendingUp className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{goal.name}</h3>
                    <p className="text-slate-400 text-sm">{daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo encerrado'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-white text-lg font-bold">R$ {goal.current.toLocaleString()}</span>
                  <span className="text-slate-400 text-sm">de R$ {goal.target.toLocaleString()}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 bg-surface-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-emerald-400 text-sm font-medium">{percentage.toFixed(1)}% concluído</p>
                  <p className="text-slate-400 text-sm">Meta: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
