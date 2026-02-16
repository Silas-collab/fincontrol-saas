import api from './api';
import { Category } from '../types';

export const categoryService = {
  getAll: async (): Promise<{ data: Category[] }> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Category }> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<{ data: Category }> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<{ data: Category }> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};
