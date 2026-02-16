import { Bell, Search, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar transações, contas..."
          className="w-full pl-10 pr-4 py-2 bg-surface-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-medium text-white">João Silva</p>
            <p className="text-xs text-slate-400">joao@email.com</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
