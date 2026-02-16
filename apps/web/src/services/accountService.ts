import api from './api';
import { Account } from '../types';

interface TransferData {
  amount: number;
  date: string;
  fromAccountId: string;
  toAccountId: string;
  description: string;
  notes?: string;
}

export const accountService = {
  getAll: async (): Promise<{ data: Account[] }> => {
    const response = await api.get('/accounts');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Account }> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: Partial<Account>): Promise<{ data: Account }> => {
    const response = await api.post('/accounts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Account>): Promise<{ data: Account }> => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },

  transfer: async (data: TransferData): Promise<{ data: { fromAccount: Account; toAccount: Account } }> => {
    const response = await api.post('/accounts/transfer', data);
    return response.data;
  }
};
