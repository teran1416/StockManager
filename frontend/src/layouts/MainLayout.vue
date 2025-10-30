<template>
  <div class="main-layout">
    <AppHeader />
    <main class="layout-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'

export default {
  name: 'MainLayout',
  components: { AppHeader, AppFooter }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.layout-main {
  flex: 1; 
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
