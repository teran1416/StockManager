<template>
  <div class="reports-container">
    <h1>Reportes de Inventario</h1>
    
    <div class="report-cards">
      <div class="report-card">
        <h2>Resumen de Inventario</h2>
        <div class="report-stats">
          <div class="stat-item">
            <span class="stat-label">Total de Productos:</span>
            <span class="stat-value">{{ productStore.totalProducts }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Valor Total:</span>
            <span class="stat-value">${{ formatCurrency(productStore.totalInventoryValue) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Productos con Stock Bajo:</span>
            <span class="stat-value">{{ productStore.lowStockProducts.length }}</span>
          </div>
        </div>
      </div>
      
      <div class="report-card">
        <h2>Productos con Stock Bajo</h2>
        <table v-if="productStore.lowStockProducts.length > 0" class="report-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Diferencia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productStore.lowStockProducts" :key="product._id">
              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.minStockThreshold }}</td>
              <td class="stock-diff">{{ product.quantity - product.minStockThreshold }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-data">No hay productos con stock bajo.</p>
      </div>
    </div>
    
    <div class="report-card full-width">
      <h2>Listado de Productos</h2>
      <table class="report-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product._id">
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>${{ product.price.toFixed(2) }}</td>
            <td>{{ product.quantity }}</td>
            <td>${{ (product.price * product.quantity).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="export-actions">
      <button @click="printReport" class="print-button">
        Imprimir Reporte
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useProductStore } from '../store/products'

export default {
  name: 'Reports',
  setup() {
    const productStore = useProductStore()
    
    onMounted(async () => {
      await productStore.fetchProducts()
      await productStore.fetchLowStockProducts()
    })
    
    const formatCurrency = (value) => {
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    
    const printReport = () => {
      window.print()
    }
    
    return {
      productStore,
      formatCurrency,
      printReport
    }
  }
}
</script>

<style scoped>
.reports-container {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.report-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.report-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.full-width {
  grid-column: 1 / -1;
}

.report-card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 20px;
}

.report-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-weight: bold;
  color: #555;
}

.stat-value {
  font-weight: bold;
  color: #42b983;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.report-table th, .report-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.report-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.stock-diff {
  color: #dc3545;
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: #666;
  padding: 20px 0;
}

.export-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.print-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

/* Estilos para impresión */
@media print {
  .export-actions {
    display: none;
  }
  
  .reports-container {
    padding: 0;
  }
  
  .report-card {
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .report-cards {
    grid-template-columns: 1fr;
  }
  
  .report-table {
    font-size: 14px;
  }
  
  .report-table th, .report-table td {
    padding: 8px 5px;
  }
}
</style>