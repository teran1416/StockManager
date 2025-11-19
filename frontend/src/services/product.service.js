// Importa la instancia base de API
import api from './api';

// Servicio para operaciones CRUD de productos
export const productService = {
  // Obtiene todos los productos
  async getAllProducts() {
    const response = await api.get('/products');
    return response.data;
  },

  // Obtiene un producto por su ID
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Crea un producto nuevo
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Actualiza datos de un producto existente
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Elimina un producto por ID
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};