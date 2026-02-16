import { motion } from 'framer-motion'
import { Plus, Wallet, CreditCard, PiggyBank, TrendingUp, MoreVertical } from 'lucide-react'

const accounts = [
  { id: 1, name: 'Conta Corrente', type: 'checking', balance: 8450.50, currency: 'BRL', color: '#10b981' },
  { id: 2, name: 'Conta Poupança', type: 'savings', balance: 12500.00, currency: 'BRL', color: '#3b82f6' },
  { id: 3, name: 'Cartão de Crédito', type: 'credit', balance: -1250.00, currency: 'BRL', color: '#f59e0b' },
  { id: 4, name: 'Investimentos', type: 'investment', balance: 2780.00, currency: 'BRL', color: '#8b5cf6' },
]

const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0)

export default function Accounts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas</h1>
          <p className="text-slate-400 mt-1">Gerencie suas contas bancárias</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Nova Conta
        </button>
      </div>

      {/* Total Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass-card p-8 text-center"
      >
        <p className="text-slate-400 mb-2">Saldo Total</p>
        <h2 className="text-4xl font-bold gradient-text">R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
      </motion.div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${account.color}20` }}>
                  {account.type === 'checking' && <Wallet className="w-6 h-6" style={{ color: account.color }} />}
                  {account.type === 'savings' && <PiggyBank className="w-6 h-6" style={{ color: account.color }} />}
                  {account.type === 'credit' && <CreditCard className="w-6 h-6" style={{ color: account.color }} />}
                  {account.type === 'investment' && <TrendingUp className="w-6 h-6" style={{ color: account.color }} />}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{account.name}</h3>
                  <p className="text-slate-400 text-sm capitalize">{account.type}</p>
                </div>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
