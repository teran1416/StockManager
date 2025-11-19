// Importa la función createApp para inicializar una aplicación Vue 3
import { createApp } from 'vue'
// Importa createPinia para configurar el store de estado global (Pinia)
import { createPinia } from 'pinia'
// Importa el componente raíz de la aplicación
import App from './App.vue'
// Importa el enrutador de Vue para manejar navegación entre vistas
import router from './router'
// Importa estilos globales de la aplicación
import './assets/main.css'

// Crea la instancia principal de la aplicación Vue
const app = createApp(App)

// Registra Pinia como gestor de estado global
app.use(createPinia())
// Registra el enrutador para habilitar navegación basada en rutas
app.use(router)

// Monta la aplicación en el elemento con id "app" del DOM
app.mount('#app')