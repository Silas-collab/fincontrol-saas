import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Calendar, Download } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { dashboardService } from '../services/dashboardService';
import { transactionService } from '../services/transactionService';

export function Reports() {
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    byCategory: [],
    byMonth: []
  });

  useEffect(() => {
    fetchReportData();
  }, [period]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getSummary();
      // Simular dados de relatório
      setData({
        income: response.data?.monthlyIncome || 0,
        expense: response.data?.monthlyExpense || 0,
        balance: (response.data?.monthlyIncome || 0) - (response.data?.monthlyExpense || 0),
        byCategory: [],
        byMonth: []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Relatórios</h1>
            <p className="text-slate-400 mt-1">Análise detalhada das suas finanças</p>
          </div>
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Receitas</span>
            </div>
            <p className="text-3xl font-bold text-white">R$ {data.income.toFixed(2)}</p>
          </div>

          <div className="bg-rose-500/10 rounded-2xl p-6 border border-rose-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <span className="text-rose-400 font-medium">Despesas</span>
            </div>
            <p className="text-3xl font-bold text-white">R$ {data.expense.toFixed(2)}</p>
          </div>

          <div className={`rounded-2xl p-6 border ${
            data.balance >= 0 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-rose-500/10 border-rose-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className={`w-5 h-5 ${data.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
              <span className={`font-medium ${data.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                Saldo
              </span>
            </div>
            <p className={`text-3xl font-bold ${data.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              R$ {data.balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h3>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de categorias em desenvolvimento</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Evolução Mensal</h3>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Gráfico de evolução em desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


export default Reports;
