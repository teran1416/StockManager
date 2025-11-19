<!-- Vista de registro de usuario con validaciones y toggle de contraseña -->
<template>
  <div class="register-container">
    <!-- Título principal -->
    <h1>Registro de Usuario</h1>
    <!-- Formulario controlado con prevent para evitar recarga -->
    <form @submit.prevent="handleRegister" class="register-form">
      <!-- Campo de nombre completo -->
      <div class="form-group">
        <label for="fullName">Nombre Completo</label>
        <input id="fullName" v-model="fullName" type="text" required placeholder="Ingresa tu nombre completo" />
      </div>

      <!-- Campo de email con validación al perder el foco -->
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input id="email" v-model="email" type="email" required placeholder="Ingresa tu correo" @blur="validateEmail" />
        <p v-if="emailError" class="field-error"><i class="fas fa-exclamation-circle"></i> {{ emailError }}</p>
      </div>

      <!-- Campo de contraseña con botón para mostrar/ocultar -->
      <div class="form-group">
        <label for="password">Contraseña</label>
        <div class="password-input-group">
          <input 
            id="password" 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            placeholder="Ingresa tu contraseña" 
            @blur="validatePassword"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <!-- Requisitos mínimos de la contraseña -->
        <p class="password-requirements">La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.</p>
        <!-- Mensaje de error específico para contraseña -->
        <p v-if="passwordError" class="field-error"><i class="fas fa-exclamation-circle"></i> {{ passwordError }}</p>
      </div>

      <!-- Mensaje de error general -->
      <p v-if="error" class="error-message"><i class="fas fa-exclamation-triangle"></i> {{ error }}</p>

      <!-- Botón de envío con estado de carga -->
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <!-- Enlace a la vista de login -->
      <div class="login-link">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </div>
    </form>
  </div>
</template>

<script>
// Importa el store de autenticación para registrar usuarios
import { useAuthStore } from '@/store/auth'

export default {
  // Nombre de la vista
  name: 'Register',
  // API de opciones: estado local del formulario
  data() {
    return {
      // Campos del formulario
      fullName: '',
      email: '',
      password: '',
      // Mensajes de error generales y por campo
      error: '',
      emailError: '',
      passwordError: '',
      // Estado de carga y toggle de visibilidad de contraseña
      loading: false,
      showPassword: false
    }
  },
  // Métodos para validación y envío del formulario
  methods: {
    validateEmail() {
      // Valida formato y restringe dominios a gmail.com o hotmail.com
      const emailRegex = /^[^\s@]+@(?:gmail\.com|hotmail\.com)$/i
      if (!emailRegex.test(this.email)) {
        this.emailError = 'No es un correo valido'
        return false
      }
      this.emailError = ''
      return true
    },
    
    validatePassword() {
      // Requisitos: 8+ caracteres, 1 mayúscula, 1 número y 1 carácter especial
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
      if (!passwordRegex.test(this.password)) {
        this.passwordError = 'La contraseña no cumple con los requisitos de seguridad'
        return false
      }
      this.passwordError = ''
      return true
    },
    
    async handleRegister() {
      // Limpia error general
      this.error = ''
      
      // Valida campos antes de enviar
      const isEmailValid = this.validateEmail()
      const isPasswordValid = this.validatePassword()
      
      // Si alguna validación falla, no continúa
      if (!isEmailValid || !isPasswordValid) {
        return
      }
      
      // Activa estado de carga
      this.loading = true
      try {
        // Usa el store de auth para registrar
        const auth = useAuthStore()
        const { success, message } = await auth.register(
          this.fullName.trim(),
          this.email.trim().toLowerCase(),
          this.password
        )
        // Navega al Home si fue exitoso
        if (success) this.$router.push({ name: 'Home' })
        // Muestra mensaje de error si falla
        else this.error = message || 'No se pudo registrar'
      } catch (e) {
        // Error genérico de red/servidor
        this.error = 'Error al registrarse. Intenta nuevamente.'
      } finally {
        // Desactiva estado de carga
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Contenedor principal de la vista de registro */
.register-container { max-width: 400px; margin: 0 auto; padding: 20px; }
/* Formulario con layout vertical y separación entre campos */
.register-form { display: flex; flex-direction: column; gap: 15px; }
/* Grupo de campos con etiqueta y input */
.form-group { display: flex; flex-direction: column; gap: 5px; }
/* Contenedor del input de contraseña con botón interno */
.password-input-group { 
  position: relative; 
  display: flex; 
  align-items: center; 
}
/* Input de contraseña con espacio para el botón */
.password-input-group input { 
  width: 100%; 
  padding-right: 40px; 
}
/* Botón para alternar visibilidad de contraseña */
.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
}
/* Hover del botón toggle */
.toggle-password:hover {
  color: #42b983;
}
/* Estilo general de inputs */
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
/* Botón principal */
button { background: #42b983; color: white; border: none; padding: 12px; border-radius: 4px; font-size: 16px; cursor: pointer; }
/* Hover del botón */
button:hover { background: #3aa876; }
/* Estado deshabilitado del botón */
button:disabled { background: #a0cfbb; cursor: not-allowed; }
/* Mensaje de error general */
.error-message { color: #e74c3c; font-size: 14px; text-align: center; }
/* Error por campo */
.field-error { color: #e74c3c; font-size: 14px; margin-top: 5px; }
/* Texto con requisitos de contraseña */
.password-requirements { font-size: 12px; color: #666; margin-top: 5px; }
/* Enlace a login */
.login-link { text-align: center; margin-top: 15px; font-size: 14px; }
.login-link a { color: #42b983; text-decoration: none; font-weight: bold; }
.login-link a:hover { text-decoration: underline; }
</style>
