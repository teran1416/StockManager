// Importa Mongoose para definir el esquema y modelo de productos
const mongoose = require('mongoose');

// Define el esquema de producto con campos y validaciones relevantes
const productSchema = new mongoose.Schema({
  // Nombre del producto (obligatorio y sin espacios extra)
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Descripción del producto (obligatorio y sin espacios extra)
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Cantidad disponible en inventario (no negativa)
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  // Precio unitario del producto (no negativo)
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Umbral mínimo de stock para alertas (por defecto 5)
  minStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  // Referencia al usuario propietario/creador del producto
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Fecha de creación del documento
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Fecha de última actualización del documento
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hook pre-save: actualiza el campo updatedAt antes de guardar
productSchema.pre('save', function(next) {
  // Establece la fecha y hora actual como última actualización
  this.updatedAt = Date.now();
  // Continúa con el proceso de guardado
  next();
});

// Crea el modelo Product a partir del esquema definido
const Product = mongoose.model('Product', productSchema);

// Exporta el modelo para utilizarlo en controladores y rutas
module.exports = Product;