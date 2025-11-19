// Importa Express para crear el enrutador de usuarios
const express = require('express');
// Crea una instancia de Router para agrupar rutas bajo un mismo módulo
const router = express.Router();
// Importa los controladores relacionados con usuarios
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
// Importa el middleware de autenticación para proteger rutas
const auth = require('../middleware/auth');

// Ruta POST para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta POST para iniciar sesión de usuario
router.post('/login', loginUser);

// Ruta GET para obtener el perfil del usuario; requiere autenticación (auth)
router.get('/profile', auth, getUserProfile);

// Exporta el enrutador para registrarlo en la aplicación principal
module.exports = router;