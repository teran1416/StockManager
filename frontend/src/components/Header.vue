<template>
  <header class="app-header">
    <div class="logo">
      <h1>StockManager</h1>
    </div>
    <nav class="main-nav">
      <router-link to="/" class="nav-link">
        <i class="fas fa-home"></i> Inicio
      </router-link>
      <router-link to="/products" class="nav-link">
        <i class="fas fa-box"></i> Productos
      </router-link>
      <router-link to="/reports" class="nav-link">
        <i class="fas fa-chart-bar"></i> Reportes
      </router-link>
      <button @click="logout" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'

export default {
  name: 'AppHeader',
  setup() {
    const authStore = useAuthStore()
    const logout = () => authStore.logout()
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    return { logout, isAuthenticated }
  }
}
</script>

<style scoped>
.app-header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo h1 { color: white; font-size: 1.5rem; font-weight: 600; }
.main-nav { display:flex; gap:1.5rem; align-items:center }
.nav-link { color: #ecf0f1; text-decoration:none; padding:0.5rem 1rem; border-radius:4px }
.nav-link:hover { background: rgba(255,255,255,0.06) }
.logout-btn { margin-left:1rem; background:#e74c3c; color:white; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer }
.logout-btn:hover { background:#c0392b }
</style>
