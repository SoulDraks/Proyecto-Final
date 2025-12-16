const Express = require("express");
const Rutas = Express.Router();

const {
    ObtenerMesas,
    AgregarMesa,
    ModificarMesa,
    EliminarMesa,
    PedirMesa
} = require("../Controller/Mesas.Controller");

Rutas.get("/obtenermesas", ObtenerMesas);
Rutas.post("/agregarmesa", AgregarMesa);
Rutas.post("/modificarmesa", ModificarMesa);
Rutas.post("/eliminarmesa", EliminarMesa);
Rutas.post("/pedirmesa", PedirMesa);

module.exports = Rutas;