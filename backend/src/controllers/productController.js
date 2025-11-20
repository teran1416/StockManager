// Importa el modelo Product para interactuar con la colección de productos en la base de datos
const Product = require('../models/Product');

// Obtiene todos los productos
exports.getProducts = async (req, res) => {
  try {
    // Busca todos los documentos de productos sin filtros
    const products = await Product.find({ user: req.user.id });
    // Devuelve la lista completa de productos en formato JSON
    res.json(products);
  } catch (error) {
    // Maneja errores del servidor durante la operación
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Obtiene un producto específico por su ID
exports.getProductById = async (req, res) => {
  try {
    // Busca el producto usando el parámetro de ruta :id
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    // Si no existe, devuelve 404 (no encontrado)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Devuelve el producto encontrado
    res.json(product);
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Crea un nuevo producto
exports.createProduct = async (req, res) => {
  try {
    // Extrae los campos necesarios del cuerpo de la solicitud
    const { name, description, quantity, price, minStockThreshold } = req.body;

    // Construye una instancia de Product con los datos proporcionados
    const product = new Product({
      name,
      description,
      quantity,
      price,
      // Usa el umbral proporcionado o un valor por defecto de 5
      minStockThreshold: minStockThreshold || 5,
      // Asocia el producto al usuario autenticado (req.user.id)
      user: req.user.id
    });

    // Guarda el producto en la base de datos y devuelve el creado con estado 201
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Actualiza un producto existente
exports.updateProduct = async (req, res) => {
  try {
    // Extrae posibles campos a actualizar del cuerpo de la solicitud
    const { name, description, quantity, price, minStockThreshold } = req.body;

    // Busca el producto por su ID
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    // Si no existe, devuelve 404
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Actualiza cada campo si llega un valor; de lo contrario, conserva el actual
    product.name = name || product.name;
    product.description = description || product.description;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.price = price || product.price;
    product.minStockThreshold = minStockThreshold || product.minStockThreshold;

    // Guarda los cambios y devuelve el producto actualizado
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Elimina un producto
exports.deleteProduct = async (req, res) => {
  try {
    // Busca el producto por ID
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    // Si no existe, devuelve 404
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Elimina el documento de forma compatible con versiones recientes de Mongoose
    await Product.deleteOne({ _id: product._id, user: req.user.id });
    res.json({ message: 'Product removed' });
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Actualiza el stock (sumar o restar)
exports.updateStock = async (req, res) => {
  try {
    // Extrae la cantidad y el indicador de operación (true para sumar, false para restar)
    const { quantity, isAddition } = req.body;

    // Busca el producto por ID
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    // Si no existe, devuelve 404
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Suma o resta stock según el indicador isAddition
    if (isAddition) {
      product.quantity += Number(quantity);
    } else {
      // Verifica que exista suficiente stock antes de restar
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      product.quantity -= Number(quantity);
    }

    // Guarda el producto actualizado
    const updatedProduct = await product.save();

    // Determina si el stock quedó por debajo del umbral mínimo
    const isLowStock = updatedProduct.quantity <= updatedProduct.minStockThreshold;

    // Devuelve el producto actualizado, indicador de stock bajo y mensaje opcional
    res.json({
      product: updatedProduct,
      isLowStock,
      message: isLowStock ? 'Warning: Stock is below threshold' : ''
    });
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Obtiene productos con stock bajo (cantidad <= umbral mínimo)
exports.getLowStockProducts = async (req, res) => {
  try {
    // Usa una expresión para comparar cantidad con minStockThreshold dentro del documento
    const products = await Product.find({
      user: req.user.id,
      $expr: { $lte: ["$quantity", "$minStockThreshold"] }
    });

    // Devuelve los productos que cumplen la condición
    res.json(products);
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Exporta productos a CSV para descarga
exports.exportProductsCSV = async (req, res) => {
  try {
    // Obtiene todos los productos
    const products = await Product.find({ user: req.user.id });

    // Define encabezados del CSV
    const headers = ['Nombre', 'Descripción', 'Precio', 'Cantidad', 'Stock Mínimo', 'Valor Total'];
    // Genera filas transformando los productos en arreglos de valores
    const rows = products.map(product => [
      product.name,
      product.description,
      product.price,
      product.quantity,
      product.minStockThreshold,
      product.price * product.quantity
    ]);

    // Convierte encabezados y filas al formato CSV separado por comas
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Configura los headers HTTP para indicar un archivo CSV descargable
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=stock_report.csv');

    // Envía el contenido CSV como respuesta
    res.send(csvContent);
  } catch (error) {
    // Maneja errores del servidor
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
