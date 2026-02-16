import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Globe, Moon, Sun } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    goalUpdates: true
  });
  const [darkMode, setDarkMode] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Assinatura', icon: CreditCard },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-slate-400 mt-1">Gerencie suas preferências e conta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Informações do Perfil</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ''}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Sobrenome</label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ''}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5 text-violet-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
                      <div>
                        <p className="text-white font-medium">Tema Escuro</p>
                        <p className="text-sm text-slate-400">Alternar entre tema claro e escuro</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-violet-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <button className="px-6 py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
                    Salvar Alterações
                  </button>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Preferências de Notificação</h2>

                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium capitalize">
                          {key === 'email' && 'Notificações por Email'}
                          {key === 'push' && 'Notificações Push'}
                          {key === 'budgetAlerts' && 'Alertas de Orçamento'}
                          {key === 'goalUpdates' && 'Atualizações de Metas'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-violet-500' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Segurança da Conta</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Senha Atual</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nova Senha</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button className="px-6 py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
                    Alterar Senha
                  </button>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Plano de Assinatura</h2>

                  <div className="p-6 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-violet-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-violet-400 font-medium">Plano Atual</p>
                        <h3 className="text-2xl font-bold text-white">Gratuito</h3>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">
                      Você está usando o plano gratuito com recursos limitados.
                    </p>
                    <button className="px-6 py-2.5 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
                      Fazer Upgrade
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


export default Settings;
