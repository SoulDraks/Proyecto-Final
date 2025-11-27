const Express = require("express");
const Rutas = Express.Router();
const multer = require("multer");
const upload = multer()

const {
    Registrarse,
    Login,
    LoginAdmin,
    ObtenerProductos,
    ObtenerPromos,
    ObtenerCarrito,
    AñadirProdCarrito,
    EliminarProdCarrito,
    AñadirPromCarrito,
    EliminarPromCarrito,
    AñadirProducto,
    ModificarProducto,
    EliminarProducto,
    AñadirPromo,
    ModificarPromo,
    EliminarPromo
} = require("../Controller/Login.Controller");

Rutas.post("/registrarse", Registrarse);
Rutas.post("/login", Login);
Rutas.post("/loginadmin", LoginAdmin);
Rutas.get("/obtenerproductos", ObtenerProductos);
Rutas.get("/obtenerpromos", ObtenerPromos);
Rutas.post("/obtenercarrito", ObtenerCarrito);
Rutas.post("/añadirprodcarrito", AñadirProdCarrito);
Rutas.post("/eliminarprodcarrito", EliminarProdCarrito);
Rutas.post("/anadirpromcarrito", AñadirPromCarrito);
Rutas.post("/eliminarpromcarrito", EliminarPromCarrito);
Rutas.post("/anadirproducto", upload.single("Imagen"), AñadirProducto);
Rutas.post("/modificarproducto", upload.single("Imagen"), ModificarProducto);
Rutas.post("/eliminarproducto", EliminarProducto);
Rutas.post("/anadirpromo", upload.single("Imagen"), AñadirPromo);
Rutas.post("/modificarpromo", upload.single("Imagen"), ModificarPromo);
Rutas.post("/eliminarpromo", EliminarPromo);

module.exports = Rutas;