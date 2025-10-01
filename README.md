# StockManager - Sistema de Gestión de Inventario

StockManager es una aplicación web completa para la gestión de inventario, desarrollada con Node.js, Express, MongoDB en el backend y Vue.js 3 en el frontend.

## Características

- **Autenticación de usuarios**: Registro e inicio de sesión seguros
- **Gestión de productos**: Crear, leer, actualizar y eliminar productos
- **Control de inventario**: Seguimiento de cantidades y alertas de stock bajo
- **Reportes**: Visualización de estadísticas e informes de inventario
- **Interfaz responsive**: Diseño adaptable a dispositivos móviles y de escritorio

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT para autenticación
- bcrypt para encriptación de contraseñas

### Frontend
- Vue.js 3
- Vue Router
- Pinia para gestión de estado
- Axios para peticiones HTTP
- CSS personalizado para diseño responsive

## Estructura del Proyecto

```
stockmanager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── productController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   └── userRoutes.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── main.css
    │   ├── components/
    │   ├── router/
    │   │   └── index.js
    │   ├── store/
    │   │   ├── auth.js
    │   │   └── products.js
    │   ├── views/
    │   │   ├── Home.vue
    │   │   ├── Login.vue
    │   │   ├── Products.vue
    │   │   ├── Register.vue
    │   │   └── Reports.vue
    │   ├── App.vue
    │   └── main.js
    └── package.json
```

## Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB

### Backend

1. Navega al directorio del backend:
   ```
   cd backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en el directorio backend con las siguientes variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/stockmanager
     JWT_SECRET=tu_clave_secreta
     NODE_ENV=development
     ```

4. Inicia el servidor:
   ```
   npm run dev
   ```

### Frontend

1. Navega al directorio del frontend:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

## API Endpoints

### Usuarios
- `POST /api/users/register` - Registrar un nuevo usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users/profile` - Obtener perfil del usuario (requiere autenticación)

### Productos
- `GET /api/products` - Obtener todos los productos (requiere autenticación)
- `POST /api/products` - Crear un nuevo producto (requiere autenticación)
- `GET /api/products/:id` - Obtener un producto por ID (requiere autenticación)
- `PUT /api/products/:id` - Actualizar un producto (requiere autenticación)
- `DELETE /api/products/:id` - Eliminar un producto (requiere autenticación)
- `PUT /api/products/:id/stock` - Actualizar el stock de un producto (requiere autenticación)
- `GET /api/products/low-stock` - Obtener productos con stock bajo (requiere autenticación)

## Uso

1. Regístrate como nuevo usuario
2. Inicia sesión con tus credenciales
3. Navega por el dashboard para ver estadísticas generales
4. Gestiona tus productos desde la sección "Productos"
5. Visualiza reportes detallados en la sección "Reportes"

## Seguridad

- Autenticación mediante JWT (JSON Web Tokens)
- Contraseñas encriptadas con bcrypt
- Middleware de autenticación para proteger rutas privadas
- Validación de datos en el servidor

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.