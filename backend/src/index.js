// Importa el framework Express para crear el servidor HTTP y gestionar rutas
const express = require('express');
// Importa CORS para habilitar peticiones desde orígenes distintos al servidor
const cors = require('cors');
// Importa dotenv para cargar variables de entorno desde un archivo .env
const dotenv = require('dotenv');
// Importa la función de conexión a la base de datos definida en config/db
const connectDB = require('./config/db');

// Carga las variables de entorno definidas en el archivo .env
dotenv.config();

// Establece la conexión con la base de datos antes de iniciar el servidor
connectDB();

// Crea una instancia de la aplicación Express para configurar middleware y rutas
const app = express();

// Aplica el middleware CORS para permitir solicitudes desde el frontend (otro dominio/puerto)
app.use(cors());
// Habilita el parseo de cuerpos JSON en las solicitudes entrantes
app.use(express.json());

// Registra el conjunto de rutas relacionadas con usuarios bajo el prefijo /api/users
app.use('/api/users', require('./routes/userRoutes'));
// Registra el conjunto de rutas relacionadas con productos bajo el prefijo /api/products
app.use('/api/products', require('./routes/productRoutes'));

// Define una ruta básica para verificar que el API responde correctamente
app.get('/', (req, res) => {
  // Envía un mensaje simple como respuesta al acceder a la raíz del servidor
  res.send('API is running...');
});

// Middleware de manejo de errores: captura excepciones y responde con formato uniforme
app.use((err, req, res, next) => {
  // Si el código de estado aún es 200, establece 500 para indicar error del servidor
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Aplica el código de estado calculado a la respuesta
  res.status(statusCode);
  // Devuelve un objeto JSON con el mensaje de error y, en modo producción, oculta la pila
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Define el puerto del servidor tomando de variables de entorno o por defecto 5000
const PORT = process.env.PORT || 5000;
// Inicia el servidor HTTP escuchando en el puerto definido y muestra un mensaje en consola
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});