// Importa utilidades para crear el enrutador y el historial basado en HTML5
import { createRouter, createWebHistory } from 'vue-router'
// Importa el store de autenticación para verificar el estado del usuario
import { useAuthStore } from '../store/auth'

// Importa las vistas que serán asociadas a rutas específicas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Products from '../views/Products.vue'
import Reports from '../views/Reports.vue'

// Define el arreglo de rutas con sus componentes y metadatos
const routes = [
  {
    // Ruta raíz del sitio (dashboard principal)
    path: '/',
    // Nombre de la ruta para referencia programática
    name: 'Home',
    // Componente que se renderiza para esta ruta
    component: Home,
    // Metadatos: requiere autenticación y usa layout principal
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    // Ruta para acceso de usuarios (login)
    path: '/login',
    name: 'Login',
    component: Login,
    // Metadatos: solo para invitados (no autenticados) y usa layout de autenticación
    meta: { guest: true, layout: 'auth' }
  },
  {
    // Ruta para registro de nuevos usuarios
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true, layout: 'auth' }
  },
  {
    // Ruta para gestión de productos
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    // Ruta para informes y reportes
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true, layout: 'main' }
  }
]

// Crea el enrutador con historial basado en la URL y registra las rutas
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guard de navegación: controla acceso según autenticación y metadatos de las rutas
router.beforeEach((to, from, next) => {
  // Obtiene el store de autenticación para verificar el estado actual
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  
  // Si la ruta requiere autenticación y el usuario no está autenticado, redirige a Login
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      next()
    }
  // Si la ruta es solo para invitados y el usuario está autenticado, redirige a Home
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next({ name: 'Home' })
    } else {
      next()
    }
  // Si no hay restricciones, continúa normalmente
  } else {
    next()
  }
})

// Exporta el enrutador para su uso en la aplicación principal
export default router