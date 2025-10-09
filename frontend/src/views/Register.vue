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
        <input id="email" v-model="email" type="email" required placeholder="Ingresa tu correo" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" minlength="6" required placeholder="Ingresa tu contraseña" />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

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
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
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
.login-link { text-align: center; margin-top: 15px; font-size: 14px; }
.login-link a { color: #42b983; text-decoration: none; font-weight: bold; }
.login-link a:hover { text-decoration: underline; }
</style>
