const express = require('express');
const router = express.Router();
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
const auth = require('../middleware/auth');

// All routes are protected with auth middleware
router.use(auth);

// Get all products
router.get('/', getProducts);

// Get low stock products
router.get('/low-stock', getLowStockProducts);

// Get single product
router.get('/:id', getProductById);

// Create a product
router.post('/', createProduct);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

// Update stock (add or remove)
router.put('/:id/stock', updateStock);

// Export products to CSV
router.get('/export/csv', exportProductsCSV);

module.exports = router;