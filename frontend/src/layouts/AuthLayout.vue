<!-- Componente de layout para páginas de autenticación (login/registro) -->
<template>
  <!-- Contenedor principal que centra vertical y horizontalmente el contenido -->
  <div class="auth-layout">
    <!-- Caja interna con ancho máximo y estilos de tarjeta -->
    <div class="auth-container">
      <!-- Slot para renderizar el contenido de la página hija -->
      <slot />
    </div>
  </div>
</template>

<script>
// Exporta el componente Vue
export default {
  // Nombre del componente utilizado por Vue y herramientas de depuración
  name: 'AuthLayout'
}
</script>

<style scoped>
/* Contenedor que ocupa toda la altura y centra su contenido */
.auth-layout { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f5f5f5; }
/* Caja del formulario con ancho máximo y sombra ligera */
.auth-container { width:100%; max-width:480px; padding:24px; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08) }
</style>
