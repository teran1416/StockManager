<template>
  <div class="app-container">
    <header v-if="isAuthenticated">
      <nav>
        <router-link to="/">Inicio</router-link>
        <router-link to="/products">Productos</router-link>
        <router-link to="/reports">Reportes</router-link>
        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from './store/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()

    const logout = () => {
      authStore.logout()
    }

    return {
      isAuthenticated: authStore.isAuthenticated,
      logout
    }
  }
}
</script>