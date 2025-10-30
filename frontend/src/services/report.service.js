import api from './api';

export const reportService = {
  async generateStockReport() {
    const response = await api.get('/products/report');
    return response.data;
  },

  async exportToCsv() {
    const response = await api.get('/products/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  }
};