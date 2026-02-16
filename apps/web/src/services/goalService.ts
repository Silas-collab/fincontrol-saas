import api from './api';
import { Goal } from '../types';

export const goalService = {
  getAll: async (): Promise<{ data: Goal[] }> => {
    const response = await api.get('/goals');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Goal }> => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  create: async (data: Partial<Goal>): Promise<{ data: Goal }> => {
    const response = await api.post('/goals', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Goal>): Promise<{ data: Goal }> => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  contribute: async (id: string, amount: number): Promise<{ data: Goal }> => {
    const response = await api.post(`/goals/${id}/contribute`, { amount });
    return response.data;
  }
};
