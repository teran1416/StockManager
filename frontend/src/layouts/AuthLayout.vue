<template>
  <div class="auth-layout">
    <div class="auth-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f5f5f5; }
.auth-container { width:100%; max-width:480px; padding:24px; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08) }
</style>
