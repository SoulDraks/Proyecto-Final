# PROYECTO NODE + REACT + SQLITE3

Proyecto escolar realizado con **Node.js**, **React** y **SQLite3**, con un sistema de gestión de productos, clientes, carrito de compras y promociones.

## 📚 Datos del Curso
- **Materia**: Lab. De Diseño Web Dinamico
- **Curso**: 6to 3ra
- **Taller**: 6.8
- **Docente**: Gareis Pablo

## Division

* 📃 **Documentación**: Sebastian Lopez
* 💹 **Marketing**: Luciano Quatrano
* 💻 **FrontEnd**: Alexis Martinez
* 🛠 **BackEnd**: Isaias Ortega
* ⚙ **FullStack**: Maximo Posse

## Tecnologías Utilizadas

* **Lenguajes:** JavaScript
* **FrontEnd:** React
* **BackEnd:** Node.js, Express, Multer, NodeMailer
* **Base de Datos:** SQLite3

## Estructura del Proyecto

```
Proyecto Final
├─ Server                              # BackEnd (Node.js)         
│ │ ├─ node_modules
│ │ ├─ src
│ │ │  ├─ Controller                   # Métodos de la Capa Lógica
│ │ │  |  ├─ Carrito.Controller.js     # Manipulacion de los Productos en Carrito
│ │ │  |  ├─ Login.Controller.js       # Manejo de la Registracion y Login de Clientes y Empleados
│ │ │  |  └─ Productos.Controller.js   # Manipulacion de Productos y Promos en Base de Datos
│ │ │  ├─ DataBase                     # Creacion de Tabla y Base de Datos
│ │ │  ├─ Router                       # Rutas de la Api
│ │ │  └─ Utils                        # Validación y Token
│ │ ├─ .gitignore                      # No Permite subir a github algunos Elementos
│ │ ├─ app.js                          # Archivo Raiz de BackEnd
│ │ ├─ package-lock.json
│ │ └─ package.json
├─ Client                              # FrontEnd (React)
│ | ├─ node_modules             
│ | ├─ public                          # Archivos públicos (HTML, imágenes)
│ | ├─ src
│ | │  ├─ Components                   # Componentes React reutilizables
│ | │  │  ├─ Admin                     # Sección de administración
│ | │  │  │  ├─ AdminPanel.jsx
│ | │  │  │  ├─ ProductsSection.jsx
│ | │  │  │  └─ PromosSection.jsx
│ | │  │  ├─ Bebidas                   # Componentes para bebidas
│ | │  │  │  └─ DrinkCard.jsx
│ | │  │  ├─ Cart                      # Componentes del carrito de compras
│ | │  │  │  ├─ Cart.jsx
│ | │  │  │  └─ CartButton.jsx
│ | │  │  ├─ Login                     # Componentes de login y registro
│ | │  │  │  ├─ Login.jsx
│ | │  │  │  └─ Login.css
│ | │  │  └─ Promotions                # Componentes para promociones
│ | │  │     ├─ BarPlayeroFooter.jsx
│ | │  │     ├─ BarPlayeroLayout.jsx
│ | │  │     └─ BarPlayeroStyles.css
│ | │  ├─ Context                      # Contextos de React para estado global
│ | │  │  ├─ AuthContext.jsx
│ | │  │  └─ CartContext.jsx
│ | │  └─ App.jsx                      # Componente raíz de React
│ | ├─ package.json
│ | ├─ package-lock.json
│ | ├─ vite.config.js
│ | ├─ index.html
│ | ├─ .gitignore
│ | └─ README.md
```

## BackEnd

### Instalación de Dependencias

```bash
npm install
```

### Correr el Servidor

```bash
npm run server
```

Por defecto, corre en: [http://localhost:3000](http://localhost:3000)

### Endpoints Principales

#### 🔑 Login y Usuarios

* `POST /api/login` → Login de clientes.
* `POST /api/loginadmin` → Login de administradores.
* `POST /api/registrarse` → Registro de clientes.
* `POST /api/registrarseadmin` → Registro de administradores (si está habilitado).
* `POST /api/enviarcorreo` → Enviar correo (por ejemplo para recuperación de contraseña).
* `GET /api/obteneradmins` → Obtener lista de administradores.
* `POST /api/eliminaradmin` → Eliminar un administrador.
* `POST /api/crearusuariosiniciales` → Inicializar usuarios por defecto (solo desarrollo).

#### 🛒 Carrito

* `POST /api/obtenercarrito` → Obtener los productos y promociones en el carrito de un cliente.
* `POST /api/anadirprodcarrito` → Añadir un producto al carrito.
* `POST /api/eliminarprodcarrito` → Eliminar un producto del carrito.
* `POST /api/vaciarcarrito` → Vaciar completamente el carrito.
* `POST /api/anadirpromcarrito` → Añadir una promoción al carrito.
* `POST /api/eliminarpromcarrito` → Eliminar una promoción del carrito.

#### 🛍 Productos y Promociones

* `GET /api/obtenerproductos` → Listado de productos.
* `GET /api/obtenerpromos` → Listado de promociones.
* `POST /api/anadirproducto` → Añadir un producto (requiere imagen y datos).
* `POST /api/modificarproducto` → Modificar un producto existente (opcional imagen nueva).
* `POST /api/eliminarproducto` → Eliminar un producto.
* `POST /api/anadirpromo` → Añadir una promoción.
* `POST /api/modificarpromo` → Modificar una promoción.
* `POST /api/eliminarpromo` → Eliminar una promoción.

## FrontEnd

### Instalación de Dependencias

```bash
npm install
```

### Correr el Cliente

```bash
npm run dev
```

Por defecto, corre en: [http://localhost:5173](http://localhost:5173)
