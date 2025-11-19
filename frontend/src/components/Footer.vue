<!-- Pie de página simple para toda la aplicación -->
<template>
  <!-- Contenedor del footer con estilos de fondo y texto -->
  <footer class="app-footer">
    <!-- Texto descriptivo del sistema -->
    <p>Sistema de Gestión de Inventario</p>
  </footer>
  </template>

<script>
// Exporta el componente Footer
export default {
  // Nombre del componente
  name: 'AppFooter'
}
</script>

<style scoped>
/* Estilos básicos del pie de página */
.app-footer { background-color:#2c3e50; color:#ecf0f1; text-align:center; padding:1rem; }
</style>
