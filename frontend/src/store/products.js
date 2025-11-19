// Importa defineStore para crear un store de Pinia
import { defineStore } from 'pinia'
// Importa axios para realizar peticiones HTTP al backend
import axios from 'axios'

// Define el store de productos con nombre 'products'
export const useProductStore = defineStore('products', {
  // Estado inicial del store de productos
  state: () => ({
    // Lista de productos cargados desde el backend
    products: [],
    // Lista de productos con bajo stock
    lowStockProducts: [],
    // Indicador de carga para mostrar feedback en la UI
    loading: false,
    // Mensaje de error en operaciones fallidas
    error: null
  }),
  // Getters: propiedades derivadas para cálculos rápidos
  getters: {
    // Devuelve el total de productos cargados
    totalProducts: (state) => state.products.length,
    // Calcula el valor total del inventario (precio * cantidad por producto)
    totalInventoryValue: (state) => {
      return state.products.reduce((total, product) => {
        return total + (product.price * product.quantity)
      }, 0)
    }
  },
  // Actions: operaciones asíncronas que interactúan con el backend y actualizan estado
  actions: {
    // Carga todos los productos desde el backend y actualiza el estado
    async fetchProducts() {
      this.loading = true
      try {
        // Obtiene el token de autenticación desde localStorage
        const token = localStorage.getItem('token')
        // Solicita la lista de productos al backend enviando el token en el encabezado
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Almacena la lista recibida en el estado y limpia errores
        this.products = response.data
        this.error = null
      } catch (error) {
        // Registra un mensaje de error amigable
        this.error = error.response?.data?.message || 'Error al cargar productos'
      } finally {
        this.loading = false
      }
    },
    
    // Carga productos con bajo stock desde el backend
    async fetchLowStockProducts() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/products/low-stock', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.lowStockProducts = response.data
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar productos con bajo stock'
      } finally {
        this.loading = false
      }
    },
    
    // Crea un producto en el backend y lo añade al estado
    async createProduct(productData) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:5000/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Agrega el producto creado a la lista local
        this.products.push(response.data)
        this.error = null
        // Devuelve resultado de éxito y el producto creado
        return { success: true, product: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear producto'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Actualiza un producto existente en el backend y refleja el cambio en el estado
    async updateProduct(id, productData) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Encuentra el índice del producto actualizado en la lista local
        const index = this.products.findIndex(p => p._id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        this.error = null
        return { success: true, product: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar producto'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Elimina un producto en el backend y lo quita del estado local
    async deleteProduct(id) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Filtra la lista local para eliminar el producto borrado
        this.products = this.products.filter(p => p._id !== id)
        this.error = null
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al eliminar producto'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // Actualiza el stock de un producto (sumar o restar) y refleja el cambio en el estado
    async updateStock(id, quantity, isAddition) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        // Envía la cantidad y el indicador isAddition al backend para actualizar stock
        const response = await axios.put(`http://localhost:5000/api/products/${id}/stock`, 
          { quantity, isAddition },
          { headers: { Authorization: `Bearer ${token}` }}
        )
        // Busca en la lista local el producto afectado por ID
        const index = this.products.findIndex(p => p._id === id)
        if (index !== -1) {
          this.products[index] = response.data.product
        }
        this.error = null
        // Devuelve resultado con el producto actualizado y banderas relacionadas al stock
        return { 
          success: true, 
          product: response.data.product,
          isLowStock: response.data.isLowStock,
          message: response.data.message
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al actualizar stock'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})