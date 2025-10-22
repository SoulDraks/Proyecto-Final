const Express = require("express");
const Rutas = Express.Router();

const {Login, RegistroUsuario} = require("../Controller/Login.Controller");

Rutas.post("/login", Login);
Rutas.post("/registrarusuario", RegistroUsuario);

module.exports = Rutas;