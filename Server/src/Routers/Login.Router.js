const Express = require("express");
const Rutas = Express.Router();

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
Rutas.post("/añadirpromcarrito", AñadirPromCarrito);
Rutas.post("/eliminarpromcarrito", EliminarPromCarrito);
Rutas.post("/añadirproducto", AñadirProducto);
Rutas.post("/modificarproducto", ModificarProducto);
Rutas.post("/eliminarproducto", EliminarProducto);
Rutas.post("/añadirpromo", AñadirPromo);
Rutas.post("/modificarpromo", ModificarPromo);
Rutas.post("/eliminarpromo", EliminarPromo);

module.exports = Rutas;