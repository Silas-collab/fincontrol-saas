import api from './api';

export interface CreateAccountData {
  name: string;
  type: string;
  currency?: string;
  initialBalance?: number;
  color?: string;
  icon?: string;
}

export const accountService = {
  async create(data: CreateAccountData) {
    const response = await api.post('/accounts', data);
    return response.data;
  },

  async getAll() {
    const response = await api.get('/accounts');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<CreateAccountData>) {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },
};
