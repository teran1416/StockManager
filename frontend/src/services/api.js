// Importa axios para gestionar solicitudes HTTP al backend
import axios from 'axios';

// Crea una instancia de axios con configuración base
const api = axios.create({
  // URL base para todas las peticiones a la API
  baseURL: 'http://localhost:5000/api',
  // Encabezados por defecto para enviar y recibir JSON
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes: añade el token JWT si existe
api.interceptors.request.use((config) => {
  // Recupera el token guardado en localStorage
  const token = localStorage.getItem('token');
  // Si hay token, lo agrega al header Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Devuelve la configuración modificada
  return config;
});

// Interceptor de respuestas: maneja errores globales
api.interceptors.response.use(
  // En caso de éxito, devuelve la respuesta tal cual
  (response) => response,
  // En caso de error, procesa códigos relevantes
  (error) => {
    // Si la API responde 401, el token no es válido o expiró
    if (error.response?.status === 401) {
      // Limpia el token y redirige al login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Rechaza la promesa para que el caller maneje el error
    return Promise.reject(error);
  }
);

// Exporta la instancia configurada para uso en los servicios
export default api;