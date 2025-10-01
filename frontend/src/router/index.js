// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

// Vistas (ajusta las rutas a tus archivos reales)
import Login from '../views/Login.vue'
const Home = () => import('../views/Home.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    redirect: { name: 'Login' } // evita el warning por "/"
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const base =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.BASE_URL) ||
  '/'

const router = createRouter({
  history: createWebHistory(base),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.isAuthenticated // asegúrate que sea booleano

  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!isAuthenticated) return next({ name: 'Login' })
    return next()
  }

  if (to.matched.some(r => r.meta.guest)) {
    if (isAuthenticated) return next({ name: 'Home' })
    return next()
  }

  return next()
})

export default router
