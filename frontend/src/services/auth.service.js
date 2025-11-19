// Importa la instancia de axios configurada
import api from './api';

// Servicio de autenticación con operaciones de login/registro/logout
export const authService = {
  // Inicia sesión con credenciales y guarda token si existe
  async login(email, password) {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Registra un nuevo usuario con los datos proporcionados
  async register(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Cierra sesión eliminando el token almacenado
  logout() {
    localStorage.removeItem('token');
  },

  // Indica si existe un usuario autenticado (token presente)
  getCurrentUser() {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }
};