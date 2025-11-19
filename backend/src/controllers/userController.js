// Importa el modelo User para interactuar con la colección de usuarios en la base de datos
const User = require('../models/User');
// Importa jsonwebtoken para generar y verificar tokens de autenticación JWT
const jwt = require('jsonwebtoken');

// Controlador: Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  // Maneja posibles errores durante el proceso de registro
  try {
    // Extrae del cuerpo de la petición los campos necesarios para crear el usuario
    const { fullName, email, password } = req.body;

    // Valida el formato de correo electrónico y restringe los dominios a gmail.com o hotmail.com
    const emailRegex = /^[^\s@]+@(?:gmail\.com|hotmail\.com)$/i;
    // Si el email no coincide con el patrón, responde con error 400 (solicitud inválida)
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Solo se permiten correos @gmail.com o @hotmail.com' });
    }

    // Valida la contraseña: mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial
    // Alineado con el frontend; admite caracteres como .,!@# etc.
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,}$/;
    // Si la contraseña no cumple el patrón, devuelve un error con un mensaje explicativo
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial' 
      });
    }

    // Verifica si ya existe un usuario con el mismo correo electrónico en la base de datos
    const userExists = await User.findOne({ email });
    // Si existe, devuelve error 400 indicando que el usuario ya está registrado
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Crea una nueva instancia del modelo User con los datos proporcionados
    const user = new User({
      fullName,
      email,
      password
    });

    // Guarda el nuevo usuario en la base de datos
    await user.save();

    // Genera un token JWT con el id del usuario; usa la clave secreta del entorno y expira en 30 días
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Responde con estado 201 (creado) y devuelve los datos del usuario junto con el token
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token
    });
  } catch (error) {
    // Ante cualquier excepción, responde con error 500 (error de servidor) y el mensaje asociado
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controlador: Iniciar sesión de usuario
exports.loginUser = async (req, res) => {
  // Maneja posibles errores durante el proceso de inicio de sesión
  try {
    // Extrae email y password del cuerpo de la solicitud
    const { email, password } = req.body;

    // Busca un usuario por su correo electrónico en la base de datos
    const user = await User.findOne({ email });
    // Si no existe, devuelve error 401 (no autorizado) con mensaje genérico
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada (normalmente encriptada)
    const isMatch = await user.comparePassword(password);
    // Si no coincide, devuelve error 401 indicando credenciales inválidas
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Genera un nuevo token JWT para la sesión del usuario
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Devuelve los datos del usuario junto con el token para que el cliente lo utilice
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token
    });
  } catch (error) {
    // Ante cualquier excepción, responde con error 500 (error de servidor)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controlador: Obtener el perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  // Maneja posibles errores durante la obtención del perfil
  try {
    // Busca al usuario por su id (extraído del token y colocado previamente en req.user)
    // select('-password') excluye el campo password por seguridad
    const user = await User.findById(req.user.id).select('-password');
    // Si no se encuentra el usuario, devuelve 404 (no encontrado)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Si existe, devuelve el objeto usuario (sin la contraseña)
    res.json(user);
  } catch (error) {
    // Ante cualquier excepción, responde con error 500 (error de servidor)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};