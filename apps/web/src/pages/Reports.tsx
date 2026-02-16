import { motion } from 'framer-motion'
import { Download, FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react'

const reports = [
  { id: 1, name: 'Fluxo de Caixa Mensal', type: 'chart', description: 'Receitas vs Despesas do mês', icon: BarChart3 },
  { id: 2, name: 'Análise por Categoria', type: 'chart', description: 'Distribuição de gastos', icon: PieChart },
  { id: 3, name: 'Evolução Patrimonial', type: 'chart', description: 'Crescimento do patrimônio', icon: TrendingUp },
  { id: 4, name: 'Relatório Completo', type: 'pdf', description: 'PDF com todas as análises', icon: FileText },
]

export default function Reports() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Relatórios</h1>
        <p className="text-slate-400 mt-1">Análises e relatórios financeiros</p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <report.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{report.name}</h3>
                  <p className="text-slate-400 text-sm">{report.description}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
