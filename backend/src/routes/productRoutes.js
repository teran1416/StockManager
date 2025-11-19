// Importa Express para crear el enrutador de productos
const express = require('express');
// Crea una instancia de Router para agrupar las rutas de productos
const router = express.Router();
// Importa funciones del controlador de productos
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  updateStock,
  getLowStockProducts,
  exportProductsCSV
} = require('../controllers/productController');
// Importa el middleware de autenticación para proteger todas las rutas
const auth = require('../middleware/auth');

// Aplica el middleware de autenticación a todas las rutas de este enrutador
router.use(auth);

// Ruta GET para obtener todos los productos
router.get('/', getProducts);

// Ruta GET para obtener productos con stock bajo
router.get('/low-stock', getLowStockProducts);

// Ruta GET para obtener un producto por su ID
router.get('/:id', getProductById);

// Ruta POST para crear un producto nuevo
router.post('/', createProduct);

// Ruta PUT para actualizar un producto existente
router.put('/:id', updateProduct);

// Ruta DELETE para eliminar un producto
router.delete('/:id', deleteProduct);

// Ruta PUT para actualizar el stock (agregar o quitar cantidad)
router.put('/:id/stock', updateStock);

// Ruta GET para exportar productos a un archivo CSV descargable
router.get('/export/csv', exportProductsCSV);

// Exporta el enrutador para registrarlo en la aplicación principal
module.exports = router;