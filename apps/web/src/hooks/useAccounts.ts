import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';

interface Account {
  id: string;
  name: string;
  type: string;
  balance: string;
  currency: string;
  color: string | null;
}

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await accountService.getAll();
      setAccounts(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar contas');
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (data: any) => {
    try {
      const newAccount = await accountService.create(data);
      setAccounts((prev: Account[]) => [...prev, newAccount]);
      return newAccount;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Erro ao criar conta');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { accounts, isLoading, error, fetchAccounts, createAccount };
};
