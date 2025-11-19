// Importa defineStore para crear un store de Pinia
import { defineStore } from 'pinia'
// Importa axios para realizar peticiones HTTP al backend
import axios from 'axios'

// Define el store de autenticación con nombre 'auth'
export const useAuthStore = defineStore('auth', {
  // Estado inicial del store, cargando datos desde localStorage si existen
  state: () => {
    // Intenta obtener el usuario persistido en localStorage
    const storedUser = localStorage.getItem('user')
    // Devuelve el objeto de estado con usuario y token (si están presentes)
    return {
      // Parseo del usuario almacenado o null si no existe
      user: storedUser ? JSON.parse(storedUser) : null,
      // Token JWT persistido o null
      token: localStorage.getItem('token') || null
    }
  },
  // Getters: propiedades derivadas del estado
  getters: {
    // Retorna true si existe un token (usuario autenticado)
    isAuthenticated: (state) => !!state.token
  },
  // Actions: funciones que modifican el estado y realizan lógica de negocio
  actions: {
    // Establece usuario y token en estado y los persiste en localStorage
    setUser(userData) {
      this.user = userData
      this.token = userData.token
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', userData.token)
    },

    // Realiza el inicio de sesión contra el backend y actualiza estado/almacenamiento
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password
        })
        // Guarda el usuario y token retornados por el backend
        this.user = response.data
        this.token = response.data.token
        // Persiste usuario y token en localStorage para mantener sesión
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
        // Indica éxito en inicio de sesión
        return { success: true }
      } catch (error) {
        // En caso de error, devuelve un objeto con éxito false y mensaje amigable
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al iniciar sesión'
        }
      }
    },
    
    // Registra un nuevo usuario en el backend y establece la sesión
    async register(fullName, email, password) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          fullName,
          email,
          password
        })
        // Guarda el usuario y token retornados por el backend
        this.user = response.data
        this.token = response.data.token
        // Persiste usuario y token en localStorage
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
        // Indica éxito en registro
        return { success: true }
      } catch (error) {
        // Devuelve mensaje útil en caso de error
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al registrarse'
        }
      }
    },
    // Cierra la sesión: limpia estado y elimina datos persistidos
    logout() {
      this.user = null
      this.token = null
      // Elimina usuario y token del almacenamiento local
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})