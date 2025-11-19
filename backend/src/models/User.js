// Importa Mongoose para definir esquemas y modelos de datos en MongoDB
const mongoose = require('mongoose');
// Importa bcrypt para encriptar contraseñas de forma segura
const bcrypt = require('bcrypt');

// Define el esquema de usuario con los campos y restricciones necesarias
const userSchema = new mongoose.Schema({
  // Nombre completo del usuario (obligatorio y sin espacios extra al inicio/fin)
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  // Correo electrónico del usuario, único y normalizado a minúsculas
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // Contraseña encriptada del usuario (obligatoria)
  password: {
    type: String,
    required: true
  },
  // Fecha de creación del documento para auditoría
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hook pre-save: encripta la contraseña antes de guardar el usuario
userSchema.pre('save', async function(next) {
  // Si la contraseña no fue modificada, continúa sin volver a encriptar
  if (!this.isModified('password')) return next();
  
  // Maneja el proceso de generación de salt y hash de forma asíncrona
  try {
    // Genera un salt con un factor de costo de 10 para el hashing
    const salt = await bcrypt.genSalt(10);
    // Reemplaza la contraseña en texto plano por su versión encriptada
    this.password = await bcrypt.hash(this.password, salt);
    // Continúa con el flujo de guardado
    next();
  } catch (error) {
    // En caso de error durante el hashing, pasa el error al siguiente middleware
    next(error);
  }
});

// Método de instancia: compara una contraseña proporcionada con la almacenada (encriptada)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Crea el modelo User a partir del esquema definido
const User = mongoose.model('User', userSchema);

// Exporta el modelo para usarlo en controladores y otros módulos
module.exports = User;