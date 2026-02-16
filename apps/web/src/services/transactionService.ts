import api from './api';

export interface CreateTransactionData {
  accountId: string;
  categoryId?: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description?: string;
  date?: string;
  tags?: string[];
}

export const transactionService = {
  async create(data: CreateTransactionData) {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  async getAll(params?: any) {
    const response = await api.get('/transactions', { params });
    return response.data.data;
  },

  async getSummary() {
    const response = await api.get('/transactions/summary');
    return response.data.data;
  },

  async getById(id: string) {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateTransactionData>) {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data.data;
  },
};
