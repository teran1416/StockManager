// Importa jsonwebtoken para verificar tokens JWT en las peticiones
const jwt = require('jsonwebtoken');

// Middleware de autenticación: protege rutas verificando el token JWT
const auth = (req, res, next) => {
  // Usa try/catch para capturar errores en la validación del token
  try {
    // Obtiene el token del encabezado Authorization y elimina el prefijo 'Bearer '
    const token = req.header('Authorization').replace('Bearer ', '');
    // Si no hay token presente, responde con 401 indicando falta de autorización
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verifica el token utilizando la clave secreta del entorno; obtiene el payload decodificado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Añade al objeto req el usuario extraído del payload para su uso en siguientes handlers
    req.user = decoded;
    // Continúa con el siguiente middleware o controlador
    next();
  } catch (error) {
    // Si la verificación falla, devuelve 401 indicando token inválido
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Exporta el middleware para proteger rutas que requieren autenticación
module.exports = auth;