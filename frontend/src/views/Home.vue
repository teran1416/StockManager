<template>
  <div class="home-container">
    <h1>Dashboard de StockManager</h1>
    
    <div class="stats-container">
      <div class="stat-card">
        <h3>Total de Productos</h3>
        <p class="stat-value">{{ productStore.totalProducts }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Valor Total del Inventario</h3>
        <p class="stat-value">${{ formatCurrency(productStore.totalInventoryValue) }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Productos con Stock Bajo</h3>
        <p class="stat-value">{{ productStore.lowStockProducts.length }}</p>
      </div>
    </div>
    
    <div v-if="productStore.lowStockProducts.length > 0" class="low-stock-alert">
      <h2>¡Alerta! Productos con Stock Bajo</h2>
      <ul class="low-stock-list">
        <li v-for="product in productStore.lowStockProducts" :key="product._id" class="low-stock-item">
          <span class="product-name">{{ product.name }}</span>
          <span class="product-quantity">Stock actual: {{ product.quantity }}</span>
          <span class="product-threshold">Umbral mínimo: {{ product.minStockThreshold }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useProductStore } from '../store/products'

export default {
  name: 'Home',
  setup() {
    const productStore = useProductStore()
    
    onMounted(async () => {
      await productStore.fetchProducts()
      await productStore.fetchLowStockProducts()
    })
    
    const formatCurrency = (value) => {
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    
    return {
      productStore,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin-bottom: 10px;
  color: #555;
  font-size: 18px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #42b983;
}

.low-stock-alert {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.low-stock-alert h2 {
  color: #856404;
  margin-bottom: 15px;
  font-size: 20px;
}

.low-stock-list {
  list-style: none;
  padding: 0;
}

.low-stock-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ffeeba;
}

.low-stock-item:last-child {
  border-bottom: none;
}

.product-name {
  font-weight: bold;
  flex: 2;
}

.product-quantity, .product-threshold {
  flex: 1;
}

.product-quantity {
  color: #dc3545;
}

/* Responsive design */
@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .low-stock-item {
    flex-direction: column;
    gap: 5px;
  }
}
</style>