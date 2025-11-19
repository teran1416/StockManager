<!-- Layout principal para las páginas autenticadas -->
<template>
  <!-- Contenedor de toda la página -->
  <div class="main-layout">
    <!-- Cabecera fija del sitio -->
    <AppHeader />
    <!-- Zona central donde se renderizan las vistas -->
    <main class="layout-main">
      <!-- Slot para contenido de vista hija -->
      <slot />
    </main>
    <!-- Pie de página del sitio -->
    <AppFooter />
  </div>
</template>

<script>
// Importa componentes de cabecera y pie de página
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'

// Exporta el componente Vue para el layout principal
export default {
  // Nombre del componente
  name: 'MainLayout',
  // Registra componentes hijos usados en la plantilla
  components: { AppHeader, AppFooter }
}
</script>

<style scoped>
/* Contenedor del layout que ocupa toda la altura de la ventana */
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

/* Área principal con ancho máximo y márgenes centrados */
.layout-main {
  flex: 1; 
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
