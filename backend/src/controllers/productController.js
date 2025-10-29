const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
try {
    const products = await Product.find({});
    res.json(products);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get single product
exports.getProductById = async (req, res) => {
try {
    const product = await Product.findById(req.params.id);
    if (!product) {
return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Create a product
exports.createProduct = async (req, res) => {
try {
    const { name, description, quantity, price, minStockThreshold } = req.body;
    
    const product = new Product({
    name,
    description,
    quantity,
    price,
    minStockThreshold: minStockThreshold || 5,
    user: req.user.id // Añadiendo el ID del usuario autenticado
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Update a product
exports.updateProduct = async (req, res) => {
try {
    const { name, description, quantity, price, minStockThreshold } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
return res.status(404).json({ message: 'Product not found' });
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.price = price || product.price;
    product.minStockThreshold = minStockThreshold || product.minStockThreshold;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Delete a product
exports.deleteProduct = async (req, res) => {
try {
    const product = await Product.findById(req.params.id);
    if (!product) {
    return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.remove();
    res.json({ message: 'Product removed' });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Update stock (add or remove)
exports.updateStock = async (req, res) => {
try {
    const { quantity, isAddition } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
    return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add or remove stock based on isAddition flag
    if (isAddition) {
    product.quantity += Number(quantity);
    } else {
    if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
    }
    product.quantity -= Number(quantity);
    }
    
    const updatedProduct = await product.save();
    
    // Check if stock is below threshold after update
    const isLowStock = updatedProduct.quantity <= updatedProduct.minStockThreshold;
    
    res.json({
    product: updatedProduct,
    isLowStock,
    message: isLowStock ? 'Warning: Stock is below threshold' : ''
    });
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
try {
    // Find products where quantity is less than or equal to minStockThreshold
    const products = await Product.find({
    $expr: { $lte: ["$quantity", "$minStockThreshold"] }
    });
    
    res.json(products);
} catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
}
};