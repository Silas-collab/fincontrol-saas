import api from './api';

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  async getTrends(months: number = 6) {
    const response = await api.get(`/dashboard/trends?months=${months}`);
    return response.data;
  },

  async getCategoryBreakdown(type: string = 'EXPENSE') {
    const response = await api.get(`/dashboard/breakdown?type=${type}`);
    return response.data;
  },
};
