// Importa la librería Mongoose, utilizada para conectarse y trabajar con MongoDB
const mongoose = require('mongoose');

// Define una función asíncrona para establecer la conexión con la base de datos
const connectDB = async () => {
  // Inicia un bloque try/catch para capturar errores de conexión
  try {
    // Realiza la conexión a MongoDB usando la URI almacenada en la variable de entorno MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Habilita el nuevo parser de URL para evitar advertencias y mejorar compatibilidad
      useNewUrlParser: true,
      // Activa el motor de topología unificada para una gestión de conexiones más estable
      useUnifiedTopology: true,
    });
    // Si la conexión se establece correctamente, informa el host al que se conectó
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Si ocurre un error, muestra el mensaje en la consola para diagnóstico
    console.error(`Error: ${error.message}`);
    // Finaliza el proceso con código 1 para indicar que la aplicación no puede continuar sin DB
    process.exit(1);
  }
};

// Exporta la función de conexión para usarla en otros módulos del servidor
module.exports = connectDB;