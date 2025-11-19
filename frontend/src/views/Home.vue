<!-- Vista principal del dashboard con métricas e alertas de stock -->
<template>
  <div class="home-container">
    <!-- Título del panel principal -->
    <h1>Dashboard de StockManager</h1>
    
    <!-- Tarjetas de métricas resumidas -->
    <div class="stats-container">
      <!-- Total de productos registrados -->
      <div class="stat-card">
        <h3>Total de Productos</h3>
        <p class="stat-value">{{ productStore.totalProducts }}</p>
      </div>
      
      <!-- Valor total del inventario formateado -->
      <div class="stat-card">
        <h3>Valor Total del Inventario</h3>
        <p class="stat-value">{{ formatCOP(productStore.totalInventoryValue) }}</p>
      </div>
      
      <!-- Conteo de productos con bajo stock -->
      <div class="stat-card">
        <h3>Productos con Stock Bajo</h3>
        <p class="stat-value">{{ productStore.lowStockProducts.length }}</p>
      </div>
    </div>
    
    <!-- Bloque de alerta si existen productos con bajo stock -->
    <div v-if="productStore.lowStockProducts.length > 0" class="low-stock-alert">
      <h2>¡Alerta! Productos con Stock Bajo</h2>
      <ul class="low-stock-list">
        <!-- Itera sobre productos con stock bajo y muestra detalles -->
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
// Importa hooks de ciclo de vida y el store de productos
import { onMounted } from 'vue'
import { useProductStore } from '../store/products'
// Utilidad para formatear valores en COP
import { formatCOP } from '../utils/format'

export default {
  // Nombre de la vista
  name: 'Home',
  // API de composición para preparar estado y efectos
  setup() {
    // Instancia del store de productos
    const productStore = useProductStore()
    
    // Al montar la vista, cargar productos y lista de bajo stock
    onMounted(async () => {
      await productStore.fetchProducts()
      await productStore.fetchLowStockProducts()
    })
    
    // Exponer store y utilidad de formato al template
    return {
      productStore,
      formatCOP
    }
  }
}
</script>

<style scoped>
/* Contenedor principal de la vista */
.home-container {
  padding: 20px;
}

/* Título del dashboard */
h1 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

/* Grid de tarjetas de estadísticas */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* Tarjeta individual de estadística */
.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Título dentro de la tarjeta */
.stat-card h3 {
  margin-bottom: 10px;
  color: #555;
  font-size: 18px;
}

/* Valor destacado de la métrica */
.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #42b983;
}

/* Bloque de alerta para bajo stock */
.low-stock-alert {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

/* Título de alerta */
.low-stock-alert h2 {
  color: #856404;
  margin-bottom: 15px;
  font-size: 20px;
}

/* Lista de productos en alerta */
.low-stock-list {
  list-style: none;
  padding: 0;
}

/* Elemento de producto con distribución horizontal */
.low-stock-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ffeeba;
}

/* El último elemento sin borde inferior */
.low-stock-item:last-child {
  border-bottom: none;
}

/* Nombre del producto */
.product-name {
  font-weight: bold;
  flex: 2;
}

/* Cantidad actual y umbral mínimo */
.product-quantity, .product-threshold {
  flex: 1;
}

/* Color para resaltar baja cantidad */
.product-quantity {
  color: #dc3545;
}

/* Diseño responsivo para pantallas pequeñas */
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