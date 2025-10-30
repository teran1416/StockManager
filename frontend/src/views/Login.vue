<template>
  <div class="form-container">
    <h1 class="form-title">Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          placeholder="Ingresa tu correo"
        >
      </div>
      
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="Ingresa tu contraseña"
        >
      </div>
      
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      
      <button type="submit" :disabled="loading" class="btn btn-block">
        <i class="fas fa-sign-in-alt" v-if="!loading"></i>
        <i class="fas fa-spinner fa-spin" v-if="loading"></i>
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
      
      <div class="register-link">
        ¿No tienes cuenta? 
        <router-link to="/register">Regístrate aquí</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { authService } from '../services/auth.service'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    
    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = ''
        
        // Usar el servicio de autenticación
        const userData = await authService.login(email.value, password.value)
        
        // Actualizar el store con los datos del usuario
        authStore.setUser(userData)
        
        router.push('/')
      } catch (err) {
        error.value = err.response?.data?.message || 'Error al iniciar sesión'
      } finally {
        loading.value = false
      }
    }
    
    return {
      email,
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #a0cfbb;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.register-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>