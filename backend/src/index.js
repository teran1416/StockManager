// Importaciones principales
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Cargar variables de entorno desde .env
dotenv.config();

// Conectar a MongoDB
connectDB();

// Inicializar Express
const app = express();

// Middlewares globales
app.use(cors());              // Permite peticiones desde tu frontend
app.use(express.json());      // Permite leer datos en formato JSON

// Rutas del sistema
app.use('/api/users', require('./routes/userRoutes')); // Solo usuarios (registro/login)

// Ruta base para probar el servidor
app.get('/', (req, res) => {
  res.send('✅ API de StockManager funcionando correctamente');
});

// Middleware para manejo de errores genérico
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
