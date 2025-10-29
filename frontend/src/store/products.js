import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    lowStockProducts: [],
    loading: false,
    error: null
  }),
  
  getters: {
    totalProducts: (state) => state.products.length,
    totalInventoryValue: (state) => {
      return state.products.reduce((total, product) => {
        return total + (product.price * product.quantity)
      }, 0)
    }
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.products = response.data
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar productos'
      } finally {
        this.loading = false
      }
    },
    
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
    
    async createProduct(productData) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:5000/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.products.push(response.data)
        this.error = null
        return { success: true, product: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear producto'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },
    
    async updateProduct(id, productData) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`http://localhost:5000/api/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
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
    
    async deleteProduct(id) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
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
    
    async updateStock(id, quantity, isAddition) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.put(`http://localhost:5000/api/products/${id}/stock`, 
          { quantity, isAddition },
          { headers: { Authorization: `Bearer ${token}` }}
        )
        
        const index = this.products.findIndex(p => p._id === id)
        if (index !== -1) {
          this.products[index] = response.data.product
        }
        
        this.error = null
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