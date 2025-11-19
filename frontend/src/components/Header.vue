<!-- Cabecera del sitio con navegación principal y logout -->
<template>
  <!-- Elemento header con estilos de fondo y sombra -->
  <header class="app-header">
    <!-- Logotipo / título de la aplicación -->
    <div class="logo">
      <h1>StockManager</h1>
    </div>
    <!-- Menú de navegación principal -->
    <nav class="main-nav">
      <!-- Enlace a la página de inicio -->
      <router-link to="/" class="nav-link">
        <i class="fas fa-home"></i> Inicio
      </router-link>
      <!-- Enlace a la gestión de productos -->
      <router-link to="/products" class="nav-link">
        <i class="fas fa-box"></i> Productos
      </router-link>
      <!-- Enlace a reportes -->
      <router-link to="/reports" class="nav-link">
        <i class="fas fa-chart-bar"></i> Reportes
      </router-link>
      <!-- Botón para cerrar sesión -->
      <button @click="logout" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </nav>
  </header>
</template>

<script>
// Importa el store de autenticación y utilidades de Vue
import { useAuthStore } from '@/store/auth'
import { computed } from 'vue'

export default {
  // Nombre del componente
  name: 'AppHeader',
  // API de composición para estado y métodos
  setup() {
    // Instancia del store de autenticación
    const authStore = useAuthStore()
    // Método para cerrar sesión llamando a la acción del store
    const logout = () => authStore.logout()
    // Estado derivado: indica si el usuario está autenticado
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    // Expone los elementos al template
    return { logout, isAuthenticated }
  }
}
</script>

<style scoped>
/* Contenedor de la cabecera con color de fondo y sombra */
.app-header {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* Título del logo */
.logo h1 { color: white; font-size: 1.5rem; font-weight: 600; }
/* Navegación horizontal con espacio entre enlaces */
.main-nav { display:flex; gap:1.5rem; align-items:center }
/* Estilo de enlaces de navegación */
.nav-link { color: #ecf0f1; text-decoration:none; padding:0.5rem 1rem; border-radius:4px }
.nav-link:hover { background: rgba(255,255,255,0.06) }
/* Botón de salir */
.logout-btn { margin-left:1rem; background:#e74c3c; color:white; border:none; padding:0.5rem 1rem; border-radius:4px; cursor:pointer }
.logout-btn:hover { background:#c0392b }
</style>
