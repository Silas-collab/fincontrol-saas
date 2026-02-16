import api from './api';
import { Budget } from '../types';

export const budgetService = {
  getAll: async (): Promise<{ data: Budget[] }> => {
    const response = await api.get('/budgets');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Budget }> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: Partial<Budget>): Promise<{ data: Budget }> => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Budget>): Promise<{ data: Budget }> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  }
};
