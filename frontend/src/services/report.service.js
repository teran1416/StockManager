// Importa la instancia de API base
import api from './api';

// Servicio para generar y exportar reportes
export const reportService = {
  // Genera un reporte de stock desde el backend
  async generateStockReport() {
    const response = await api.get('/products/report');
    return response.data;
  },

  // Descarga el reporte en formato CSV (tipo blob)
  async exportToCsv() {
    const response = await api.get('/products/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  }
};