import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  PiggyBank, 
  Target, 
  BarChart3, 
  Settings,
  LogOut,
  Wallet2
} from 'lucide-react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: Receipt, label: 'Transações' },
  { path: '/accounts', icon: Wallet, label: 'Contas' },
  { path: '/budgets', icon: PiggyBank, label: 'Orçamentos' },
  { path: '/goals', icon: Target, label: 'Metas' },
  { path: '/reports', icon: BarChart3, label: 'Relatórios' },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 w-64 h-screen glass border-r border-white/10 z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center glow-emerald">
            <Wallet2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">FinControl</h1>
            <p className="text-xs text-slate-400">Gestão Financeira</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <NavLink
          to="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </NavLink>
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </NavLink>
      </div>
    </motion.aside>
  )
}
