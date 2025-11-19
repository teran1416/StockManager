<!-- Vista de gestión de productos con búsqueda, CRUD y modales -->
<template>
  <div class="products-container">
    <!-- Título principal de la sección -->
    <h1>Gestión de Productos</h1>
    
    <!-- Barra de acciones: agregar y buscar -->
    <div class="actions-bar">
      <!-- Botón para abrir modal de agregado -->
      <button @click="showAddModal = true" class="add-button">
        Agregar Producto
      </button>
      <!-- Campo de búsqueda reactivo -->
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar productos..." 
        class="search-input"
      />
    </div>
    
    <!-- Indicador de carga -->
    <div v-if="productStore.loading" class="loading">
      Cargando productos...
    </div>
    
    <!-- Mensaje si no hay resultados -->
    <div v-else-if="filteredProducts.length === 0" class="no-products">
      No se encontraron productos.
    </div>
    
    <!-- Grid de tarjetas de producto -->
    <div v-else class="products-grid">
      <div v-for="product in filteredProducts" :key="product._id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p class="description">{{ product.description }}</p>
        <!-- Datos principales del producto -->
        <div class="product-details">
          <p><strong>Precio:</strong> {{ formatCOP(product.price) }}</p>
          <p><strong>Cantidad:</strong> {{ product.quantity }}</p>
          <p><strong>Stock Mínimo:</strong> {{ product.minStockThreshold }}</p>
        </div>
        <!-- Acciones por producto -->
        <div class="product-actions">
          <button @click="editProduct(product)" class="edit-button">Editar</button>
          <button @click="updateStock(product)" class="stock-button">Actualizar Stock</button>
          <button @click="confirmDelete(product)" class="delete-button">Eliminar</button>
        </div>
      </div>
    </div>
    
    <!-- Modal para agregar/editar producto -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModals">&times;</span>
        <h2>{{ showEditModal ? 'Editar Producto' : 'Agregar Producto' }}</h2>
        
        <!-- Formulario que envía según el modo actual -->
        <form @submit.prevent="showEditModal ? submitEditProduct() : submitAddProduct()">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input type="text" id="name" v-model="currentProduct.name" required>
          </div>
          
          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="description" v-model="currentProduct.description" required></textarea>
          </div>
          
          <div class="form-group">
            <label for="price">Precio</label>
            <input type="number" id="price" v-model="currentProduct.price" step="0.01" min="0" required>
          </div>
          
          <div class="form-group">
            <label for="quantity">Cantidad</label>
            <input type="number" id="quantity" v-model="currentProduct.quantity" min="0" required>
          </div>
          
          <div class="form-group">
            <label for="minStockThreshold">Stock Mínimo</label>
            <input type="number" id="minStockThreshold" v-model="currentProduct.minStockThreshold" min="0" required>
          </div>
          
          <button type="submit" class="submit-button">
            {{ showEditModal ? 'Actualizar' : 'Agregar' }}
          </button>
        </form>
      </div>
    </div>
    
    <!-- Modal para actualizar stock -->
    <div v-if="showStockModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModals">&times;</span>
        <h2>Actualizar Stock: {{ currentProduct.name }}</h2>
        
        <form @submit.prevent="submitStockUpdate">
          <div class="form-group">
            <label for="newQuantity">Nueva Cantidad</label>
            <input type="number" id="newQuantity" v-model="newStockQuantity" min="0" required>
          </div>
          
          <button type="submit" class="submit-button">Actualizar Stock</button>
        </form>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModals">&times;</span>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar el producto "{{ currentProduct.name }}"?</p>
        
        <div class="modal-actions">
          <button @click="submitDeleteProduct" class="delete-confirm-button">Eliminar</button>
          <button @click="closeModals" class="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa utilidades reactivas y ciclo de vida de Vue
import { ref, computed, onMounted } from 'vue'
// Importa el store de productos (estado global)
import { useProductStore } from '../store/products'
// Función para formatear valores como moneda COP
import { formatCOP } from '../utils/format'
// Servicio específico para creación directa vía API
import { productService } from '../services/product.service'

export default {
  // Nombre de la vista
  name: 'Products',
  // API de composición para gestionar estado, efectos y acciones
  setup() {
    // Instancia del store para leer y modificar productos
    const productStore = useProductStore()
    
    // Estado local para búsqueda y visibilidad de modales
    const searchQuery = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const showStockModal = ref(false)
    const showDeleteModal = ref(false)
    
    // Producto en edición/alta y cantidad nueva de stock
    const currentProduct = ref({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      minStockThreshold: 0
    })
    
    const newStockQuantity = ref(0)
    
    // Lista filtrada por nombre y descripción según query
    const filteredProducts = computed(() => {
      if (!searchQuery.value) return productStore.products
      
      const query = searchQuery.value.toLowerCase()
      return productStore.products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      )
    })
    
    // Carga inicial de productos al montar la vista
    onMounted(async () => {
      await productStore.fetchProducts()
    })
    
    // Cierra todos los modales activos
    const closeModals = () => {
      showAddModal.value = false
      showEditModal.value = false
      showStockModal.value = false
      showDeleteModal.value = false
    }
    
    // Prepara modal de edición con datos del producto
    const editProduct = (product) => {
      currentProduct.value = { ...product }
      showEditModal.value = true
    }
    
    // Prepara modal de stock con datos del producto
    const updateStock = (product) => {
      currentProduct.value = { ...product }
      newStockQuantity.value = product.quantity
      showStockModal.value = true
    }
    
    // Abre modal de confirmación de eliminación
    const confirmDelete = (product) => {
      currentProduct.value = { ...product }
      showDeleteModal.value = true
    }
    
    // Envía alta de producto usando servicio y actualiza store
    const submitAddProduct = async () => {
      try {
        const newProduct = await productService.createProduct(currentProduct.value);
        productStore.addProduct(newProduct);
        closeModals()
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    }
    
    // Envía actualización de producto vía store
    const submitEditProduct = async () => {
      await productStore.updateProduct(currentProduct.value._id, currentProduct.value)
      closeModals()
    }
    
    // Calcula diferencia y envía actualización de stock vía store
    const submitStockUpdate = async () => {
      // Determina si se agrega o se reduce stock
      const isAddition = newStockQuantity.value > currentProduct.value.quantity;
      const quantityDiff = Math.abs(newStockQuantity.value - currentProduct.value.quantity);
      
      await productStore.updateStock(
        currentProduct.value._id, 
        quantityDiff,
        isAddition
      )
      closeModals()
    }
    
    // Elimina el producto mediante el store
    const submitDeleteProduct = async () => {
      await productStore.deleteProduct(currentProduct.value._id)
      closeModals()
    }
    
    // Exponer estado, utilidades y handlers al template
    return {
      productStore,
      searchQuery,
      filteredProducts,
      showAddModal,
      showEditModal,
      showStockModal,
      showDeleteModal,
      currentProduct,
      newStockQuantity,
      formatCOP,
      closeModals,
      editProduct,
      updateStock,
      confirmDelete,
      submitAddProduct,
      submitEditProduct,
      submitStockUpdate,
      submitDeleteProduct
    }
  }
}
</script>

<style scoped>
.products-container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

.loading, .no-products {
  text-align: center;
  margin: 40px 0;
  color: #666;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  margin-top: 0;
  color: #333;
}

.description {
  color: #666;
  margin-bottom: 15px;
}

.product-details {
  margin-bottom: 15px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
}

.edit-button, .stock-button, .delete-button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #17a2b8;
  color: white;
}

.stock-button {
  background-color: #ffc107;
  color: #212529;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.delete-confirm-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

/* Responsive design */
@media (max-width: 768px) {
  .actions-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .product-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .edit-button, .stock-button, .delete-button {
    width: 100%;
  }
}
</style>