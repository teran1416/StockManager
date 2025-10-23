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

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #333;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav a.router-link-active {
  color: #42b983;
}

.logout-btn {
  margin-left: auto;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

main {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>