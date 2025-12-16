const Express = require("express");
const Rutas = Express.Router();

const {
    Registrarse,
    RegistrarseAdmin,
    Login,
    EnviarCorreo,
    LoginAdmin,
    ObtenerAdmins,
    EliminarAdmin,
    CrearUsuariosIniciales,
    UsuarioValido
} = require("../Controller/Login.Controller");

Rutas.post("/registrarse", Registrarse);
Rutas.post("/registrarseadmin", RegistrarseAdmin);
Rutas.post("/login", Login);
Rutas.post("/enviarcorreo", EnviarCorreo);
Rutas.post("/loginadmin", LoginAdmin);
Rutas.get("/obteneradmins", ObtenerAdmins);
Rutas.post("/eliminaradmin", EliminarAdmin);
Rutas.post("/crearusuariosiniciales", CrearUsuariosIniciales); // Endpoint temporal para desarrollo
Rutas.get("/usuariovalido", UsuarioValido)

module.exports = Rutas;