// Invocar a la dependencias de encriptamiento
const Encriptar = require("bcrypt")
// --> Metodo de Seguridad
const Salto = 10;

// ---> Metodo para Registrar Contraseña Encriptada
async function EncriptarPassword(Password)
{
    const Seguridad = await Encriptar.genSalt(Salto);
    return Encriptar.hash(Password, Seguridad);
}

// ---> Metodo para Desencriptar
function CompararPassword(Password, Parametro)
{
    return Encriptar.compare(Password, Parametro);
}

module.exports = {CompararPassword, EncriptarPassword}