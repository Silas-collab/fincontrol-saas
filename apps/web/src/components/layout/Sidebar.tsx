import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Tags,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat
} from 'lucide-react';

interface SidebarProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onAddTransfer: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accounts', label: 'Contas', icon: Wallet },
  { path: '/transactions', label: 'Transações', icon: Receipt },
  { path: '/categories', label: 'Categorias', icon: Tags },
  { path: '/budgets', label: 'Orçamentos', icon: PiggyBank },
  { path: '/goals', label: 'Metas', icon: Target },
  { path: '/reports', label: 'Relatórios', icon: BarChart3 },
];

export function Sidebar({ onAddIncome, onAddExpense, onAddTransfer }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-xl
        border-r border-slate-700/50 flex flex-col
        transition-all duration-300 ease-in-out z-50
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 
                        flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">FinControl</h1>
              <p className="text-xs text-slate-400">Pro</p>
            </div>
          )}
        </div>
      </div>

      {/* Botões Rápidos */}
      <div className="p-4 space-y-2">
        {!collapsed && (
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 px-2">
            Ações Rápidas
          </p>
        )}

        <button
          onClick={onAddIncome}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                   bg-emerald-500/10 hover:bg-emerald-500/20
                   text-emerald-400 hover:text-emerald-300
                   transition-all duration-200 group"
        >
          <ArrowDownCircle className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Nova Receita</span>}
        </button>

        <button
          onClick={onAddExpense}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                   bg-rose-500/10 hover:bg-rose-500/20
                   text-rose-400 hover:text-rose-300
                   transition-all duration-200 group"
        >
          <ArrowUpCircle className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Nova Despesa</span>}
        </button>

        <button
          onClick={onAddTransfer}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                   bg-violet-500/10 hover:bg-violet-500/20
                   text-violet-400 hover:text-violet-300
                   transition-all duration-200 group"
        >
          <Repeat className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Transferência</span>}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 px-2">
            Menu
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 group
                ${active 
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : ''}`} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                   text-slate-400 hover:text-slate-200 hover:bg-slate-800/50
                   transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Configurações</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                   text-rose-400 hover:text-rose-300 hover:bg-rose-500/10
                   transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Sair</span>}
        </button>

        {!collapsed && user && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">Logado como</p>
            <p className="text-sm font-medium text-slate-300 truncate">{user.email}</p>
          </div>
        )}
      </div>

      {/* Toggle Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full
                 bg-violet-500 hover:bg-violet-400
                 flex items-center justify-center
                 shadow-lg shadow-violet-500/30
                 transition-all duration-200"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>
    </aside>
  );
}
