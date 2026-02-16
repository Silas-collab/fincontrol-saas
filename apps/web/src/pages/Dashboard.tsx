import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { month: 'Jan', income: 5000, expense: 3500 },
  { month: 'Fev', income: 5500, expense: 3800 },
  { month: 'Mar', income: 4800, expense: 3200 },
  { month: 'Abr', income: 6200, expense: 4100 },
  { month: 'Mai', income: 5800, expense: 3900 },
  { month: 'Jun', income: 6500, expense: 4200 },
]

const categoryData = [
  { name: 'Moradia', value: 1500, color: '#10b981' },
  { name: 'Alimentação', value: 800, color: '#34d399' },
  { name: 'Transporte', value: 600, color: '#6ee7b7' },
  { name: 'Lazer', value: 400, color: '#059669' },
  { name: 'Outros', value: 900, color: '#047857' },
]

const stats = [
  { 
    label: 'Saldo Total', 
    value: 'R$ 24.580,00', 
    change: '+12%', 
    trend: 'up',
    icon: Wallet,
    color: 'emerald'
  },
  { 
    label: 'Receitas (Mês)', 
    value: 'R$ 6.500,00', 
    change: '+8%', 
    trend: 'up',
    icon: TrendingUp,
    color: 'emerald'
  },
  { 
    label: 'Despesas (Mês)', 
    value: 'R$ 4.200,00', 
    change: '-3%', 
    trend: 'down',
    icon: TrendingDown,
    color: 'red'
  },
  { 
    label: 'Economia', 
    value: 'R$ 2.300,00', 
    change: '+35%', 
    trend: 'up',
    icon: PiggyBank,
    color: 'emerald'
  },
]

const recentTransactions = [
  { id: 1, description: 'Salário', amount: 6500, type: 'income', date: 'Hoje', category: 'Renda' },
  { id: 2, description: 'Supermercado', amount: -450, type: 'expense', date: 'Ontem', category: 'Alimentação' },
  { id: 3, description: 'Uber', amount: -35, type: 'expense', date: 'Ontem', category: 'Transporte' },
  { id: 4, description: 'Netflix', amount: -39, type: 'expense', date: '2 dias atrás', category: 'Lazer' },
  { id: 5, description: 'Freelance', amount: 1200, type: 'income', date: '3 dias atrás', category: 'Renda Extra' },
]

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
          Nova Transação
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-5 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Fluxo de Caixa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGradient)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-300">{cat.name}</span>
                </div>
                <span className="text-white font-medium">R$ {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Transações Recentes</h3>
          <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Ver todas</button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 hover:bg-surface-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {tx.type === 'income' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.description}</p>
                  <p className="text-slate-400 text-sm">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                {tx.type === 'income' ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
