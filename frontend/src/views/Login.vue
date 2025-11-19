<!-- Vista de inicio de sesión con formulario controlado -->
<template>
  <div class="form-container">
    <!-- Título de la página -->
    <h1 class="form-title">Iniciar Sesión</h1>
    <!-- Formulario que evita recarga y ejecuta handleLogin -->
    <form @submit.prevent="handleLogin" class="login-form">
      <!-- Campo de correo electrónico -->
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
      
      <!-- Campo de contraseña -->
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
      
      <!-- Mensaje de error si existe -->
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      
      <!-- Botón de envío con estado de carga -->
      <button type="submit" :disabled="loading" class="btn btn-block">
        <i class="fas fa-sign-in-alt" v-if="!loading"></i>
        <i class="fas fa-spinner fa-spin" v-if="loading"></i>
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
      
      <!-- Enlace a registro -->
      <div class="register-link">
        ¿No tienes cuenta? 
        <router-link to="/register">Regístrate aquí</router-link>
      </div>
    </form>
  </div>
</template>

<script>
// Importa referencias reactivas, enrutador y store de autenticación
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

export default {
  // Nombre de la vista
  name: 'Login',
  // API de composición para gestionar estado del formulario y acciones
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Campos del formulario como refs reactivas
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    
    // Maneja el envío del formulario de login
    const handleLogin = async () => {
      try {
        // Activa el estado de carga y limpia errores previos
        loading.value = true
        error.value = ''
        
        // Llama a la acción de login del store
        const result = await authStore.login(email.value, password.value)
        
        // Navega al home si fue exitoso, sino muestra mensaje
        if (result.success) {
          router.push('/')
        } else {
          error.value = result.message
        }
      } catch (err) {
        // Mensaje genérico ante fallos inesperados
        error.value = 'Error al iniciar sesión. Por favor, intente nuevamente.'
      } finally {
        // Desactiva el estado de carga
        loading.value = false
      }
    }
    
    // Expone estado y acciones al template
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
/* Contenedor del formulario de login */
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

/* Título principal */
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* Layout del formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Grupo de campos con separación vertical */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Etiquetas de campos */
label {
  font-weight: bold;
  color: #555;
}

/* Campos de entrada de texto */
input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

/* Botón de envío */
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

/* Hover del botón */
button:hover {
  background-color: #3aa876;
}

/* Estado deshabilitado del botón */
button:disabled {
  background-color: #a0cfbb;
  cursor: not-allowed;
}

/* Mensaje de error */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}

/* Enlace a la vista de registro */
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