import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password
        })
        
        this.user = response.data
        this.token = response.data.token
        
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al iniciar sesión'
        }
      }
    },
    
    async register(fullName, email, password) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          fullName,
          email,
          password
        })
        
        this.user = response.data
        this.token = response.data.token
        
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('token', response.data.token)
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Error al registrarse'
        }
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})