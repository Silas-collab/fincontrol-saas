import { useState, useEffect, useCallback } from 'react';
import { accountService } from '../services/accountService';
import { Account } from '../types';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await accountService.getAll();
      setAccounts(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar contas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = async (data: Partial<Account>) => {
    const response = await accountService.create(data);
    await fetchAccounts(); // Refresh list
    return response;
  };

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount
  };
}
