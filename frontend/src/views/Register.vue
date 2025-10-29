<template>
  <div class="register-container">
    <h1>Registro de Usuario</h1>
    <form @submit.prevent="handleRegister" class="register-form">
      <div class="form-group">
        <label for="fullName">Nombre Completo</label>
        <input id="fullName" v-model="fullName" type="text" required placeholder="Ingresa tu nombre completo" />
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input id="email" v-model="email" type="email" required placeholder="Ingresa tu correo" @blur="validateEmail" />
        <p v-if="emailError" class="field-error"><i class="fas fa-exclamation-circle"></i> {{ emailError }}</p>
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" required placeholder="Ingresa tu contraseña" @blur="validatePassword" />
        <p class="password-requirements">La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.</p>
        <p v-if="passwordError" class="field-error"><i class="fas fa-exclamation-circle"></i> {{ passwordError }}</p>
      </div>

      <p v-if="error" class="error-message"><i class="fas fa-exclamation-triangle"></i> {{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <div class="login-link">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'

export default {
  name: 'Register',
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      error: '',
      emailError: '',
      passwordError: '',
      loading: false
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Por favor ingresa un correo electrónico válido'
        return false
      }
      this.emailError = ''
      return true
    },
    
    validatePassword() {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
      if (!passwordRegex.test(this.password)) {
        this.passwordError = 'La contraseña no cumple con los requisitos de seguridad'
        return false
      }
      this.passwordError = ''
      return true
    },
    
    async handleRegister() {
      this.error = ''
      
      // Validar campos antes de enviar
      const isEmailValid = this.validateEmail()
      const isPasswordValid = this.validatePassword()
      
      if (!isEmailValid || !isPasswordValid) {
        return
      }
      
      this.loading = true
      try {
        const auth = useAuthStore()
        const { success, message } = await auth.register(
          this.fullName.trim(),
          this.email.trim().toLowerCase(),
          this.password
        )
        if (success) this.$router.push({ name: 'Home' })
        else this.error = message || 'No se pudo registrar'
      } catch (e) {
        this.error = 'Error al registrarse. Intenta nuevamente.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container { max-width: 400px; margin: 0 auto; padding: 20px; }
.register-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
button { background: #42b983; color: white; border: none; padding: 12px; border-radius: 4px; font-size: 16px; cursor: pointer; }
button:hover { background: #3aa876; }
button:disabled { background: #a0cfbb; cursor: not-allowed; }
.error-message { color: #e74c3c; font-size: 14px; text-align: center; }
.field-error { color: #e74c3c; font-size: 14px; margin-top: 5px; }
.password-requirements { font-size: 12px; color: #666; margin-top: 5px; }
.login-link { text-align: center; margin-top: 15px; font-size: 14px; }
.login-link a { color: #42b983; text-decoration: none; font-weight: bold; }
.login-link a:hover { text-decoration: underline; }
</style>
