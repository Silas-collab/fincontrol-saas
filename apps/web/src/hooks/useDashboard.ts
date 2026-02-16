import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar resumo');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrends = async (months = 6) => {
    try {
      const data = await dashboardService.getTrends(months);
      setTrends(data);
    } catch (err) {
      console.error('Erro ao carregar trends:', err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTrends();
  }, []);

  return { summary, trends, isLoading, error, fetchSummary, fetchTrends };
};
