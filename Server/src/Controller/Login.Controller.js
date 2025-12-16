const { CompararPassword, EncriptarPassword } = require("../Utils/Hash");
const { enviarCorreo } = require("../Utils/Email");
const { dbGet, dbAll, dbRun } = require("../Utils/Querys");

// Para registrar un nuevo cliente
async function Registrarse(req, res) {
    const { Nombre, Correo, Contraseña } = req.body;
    if (!Nombre || !Correo || !Contraseña)
        return res.status(400).json({ Error: "Faltan datos (Nombre, Correo o Contraseña)" });
    const Existe = await dbGet(`SELECT * FROM Cliente WHERE Nombre = ?`, [Nombre]);
    if (Existe)
        return res.status(409).json({ Error: "Nombre de usuario ya existente" });
    const Hash = await EncriptarPassword(Contraseña);
    const query = `
        INSERT INTO Cliente (Nombre, Correo, Contraseña)
        VALUES (?, ?, ?)
    `;
    const result = await dbRun(query, [Nombre, Correo, Hash]);
    return res.status(201).json({
        Mensaje: "Cliente registrado",
        Nombre,
        Correo
    });
}

// Para registrar un nuevo cliente
async function RegistrarseAdmin(req, res) {
    const { Nombre, Correo, Contraseña } = req.body;
    if (!Nombre || !Correo || !Contraseña)
        return res.status(400).json({ Error: "Faltan datos (Nombre, Correo o Contraseña)" });
    const Existe = await dbGet(`SELECT * FROM Empleado WHERE Nombre = ?`, [Nombre]);
    if (Existe)
        return res.status(409).json({ Error: "Nombre de empleado ya existente" });
    const Hash = await EncriptarPassword(Contraseña);
    const query = `
        INSERT INTO Empleado (Nombre, Correo, Contraseña)
        VALUES (?, ?, ?)
    `;
    const result = await dbRun(query, [Nombre, Correo, Hash]);
    return res.status(201).json({
        Mensaje: "Empleado Registrado",
        Nombre,
        Correo
    });
}

// Para que se loguee el cliente
/* 
    Devuelve los datos asi por ejemplo:
    {
        Mensaje: "Login exitoso",
        Cliente: {
            Id: 9999,
            Nombre: "usuario1",
            Correo: "alguncorreo@gmail.com",
            Contraseña: "passwordHasheada"
        }
    }
*/
async function Login(req, res) {
    const { Nombre, Contraseña } = req.body;
    if (!Nombre || !Contraseña)
        return res.status(400).json({ Error: "Campos vacíos" })
    const query = `SELECT * FROM Cliente WHERE Nombre = ?`;
    const Cliente = await dbGet(query, [Nombre]);
    if (!Cliente)
        return res.status(401).json({ Error: "Usuario inexistente" });
    const Hashed = await CompararPassword(Contraseña, Cliente.Contraseña);
    if (!Hashed)
        return res.status(401).json({ Error: "Contraseña incorrecta" });
    return res.status(200).json({
        Mensaje: "Login exitoso",
        Cliente
    });
}

async function EnviarCorreo(req, res) {
    const { destinatario, nombreUsuario } = req.body;
    // --- Obtener las promos ---
    const query = `
        SELECT
            Promos.ID AS PromoID,
            Promos.Nombre AS PromoNombre,
            Promos.Precio AS PromoPrecio,
            Promos.Imagen AS PromoImagen,
            GROUP_CONCAT(Productos.Nombre, ', ') AS ProductosIncluidos
        FROM PromosProductos
        LEFT JOIN Promos ON PromosProductos.ID_Promo = Promos.ID
        LEFT JOIN Productos ON PromosProductos.ID_Producto = Productos.ID
        GROUP BY Promos.ID
        ORDER BY Promos.ID
        LIMIT 5; 
    `;
    const promos = await dbAll(query);

    let promosHTML = '';
    const attachments = [];
    promos.forEach(promo => {
        const cid = `promo${promo.PromoID}@barconnect`;
        attachments.push({
            filename: `promo-${promo.PromoID}.png`,
            content: promo.PromoImagen,
            cid: cid
        });
        promosHTML += `
            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                <h3 style="margin: 0 0 6px 0; color: #007BFF;">${promo.PromoNombre}</h3>
                <img src="cid:${cid}" alt="${promo.PromoNombre}" style="width: 100%; max-width: 300px; border-radius: 6px; margin-bottom: 6px;"/>
                <p style="margin: 4px 0; font-weight: bold;">Precio: $${promo.PromoPrecio}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #555;">Incluye: ${promo.ProductosIncluidos}</p>
            </div>
        `;
    });

    const asunto = "¡Descubre las mejores promos en BarConnect! 🍻";
    const cuerpo = `
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>¡Gracias por registrarte en BarConnect! 🎉</p>
        <p>Aquí están algunas de nuestras promos más irresistibles:</p>
        ${promosHTML}
        <p style="margin-top: 16px;">No te pierdas estas ofertas, ¡están por tiempo limitado!</p>
        <hr/>
        <p style="font-size: 12px; color: #999;">Si no solicitaste este correo, ignóralo.</p>
    `;
    await enviarCorreo(destinatario, asunto, cuerpo, attachments);
    return res.status(200).json({success: true})
}

// Para que se loguee el empleado/admin
// Devuelve de la misma manera que Login pero con Empleado
async function LoginAdmin(req, res) {
    const { Nombre, Contraseña } = req.body;
    if (!Nombre || !Contraseña)
        return res.status(400).json({ Error: "Campos vacíos" });
    const Empleado = await dbGet(`SELECT * FROM Empleado WHERE Nombre = ?`, [Nombre]);
    if (!Empleado)
        return res.status(401).json({ Error: "Empleado inexistente" });
    const Hashed = await CompararPassword(Contraseña, Empleado.Contraseña);
    if (!Hashed)
        return res.status(401).json({ Error: "Contraseña incorrecta" });
    return res.status(200).json({
        Mensaje: "Login admin exitoso",
        Empleado
    });
}

// Obtener todos los administradores (solo SUPERADMIN puede ver esto)
async function ObtenerAdmins(req, res) {
    try {
        const query = "SELECT ID, Nombre, Correo, COALESCE(Rol, 'Admin') as Rol FROM Empleado ORDER BY CASE WHEN Rol = 'SUPERADMIN' THEN 1 WHEN Rol = 'Admin' THEN 2 ELSE 3 END, Nombre";
        const Admins = await dbAll(query);
        // Si no hay admins o es un array vacío, devolver array vacío
        if (!Admins) {
            return res.status(200).json([]);
        }
        return res.status(200).json(Admins);
    } catch (error) {
        console.error('Error en ObtenerAdmins:', error);
        return res.status(500).json({ Error: "Error en Server o Query", Detalle: error.message });
    }
}

// Eliminar un administrador (solo SUPERADMIN puede hacer esto)
async function EliminarAdmin(req, res) {
    const { ID } = req.body;
    const { ID_Usuario } = req.body; // ID del usuario que hace la petición

    if (!ID)
        return res.status(400).json({ Error: "Falta ID" });

    // Verificar que el usuario que hace la petición es SUPERADMIN
    if (ID_Usuario) {
        const Usuario = await dbGet(`SELECT * FROM Empleado WHERE ID = ?`, [ID_Usuario]);
        if (!Usuario || Usuario.Rol !== 'SUPERADMIN')
            return res.status(403).json({ Error: "Solo el SUPERADMIN puede eliminar administradores" });
    }

    // Verificar que el admin a eliminar existe
    const Admin = await dbGet(`SELECT * FROM Empleado WHERE ID = ?`, [ID]);
    if (!Admin)
        return res.status(404).json({ Error: "Administrador inexistente" });

    // No permitir eliminar al SUPERADMIN
    if (Admin.Rol === 'SUPERADMIN')
        return res.status(403).json({ Error: "No se puede eliminar al SUPERADMIN" });

    await dbRun(`DELETE FROM Empleado WHERE ID = ?`, [ID]);
    return res.status(200).json({ Mensaje: "Administrador eliminado", AdminID: ID });
}

// Endpoint temporal para crear usuarios iniciales (solo para desarrollo)
async function CrearUsuariosIniciales(req, res) {
    try {
        const { crearUsuariosIniciales } = require('../Utils/initUsers');
        await crearUsuariosIniciales();
        return res.status(200).json({ Mensaje: "Usuarios iniciales creados/verificados" });
    } catch (error) {
        return res.status(500).json({ Error: "Error al crear usuarios", Detalle: error.message });
    }
}

// Endpoint que valida a un usuario cuando quiere recuperar su cuenta.
async function UsuarioValido(req, res) {
    const { Usuario, Correo } = req.body;
    const User = await dbGet("SELECT * FROM Cliente WHERE Nombre = ?", [Usuario]);
    if (!User)
        return res.status(404).json({ valid: false, Error: "Usuario Inexistente" });
    if (User.Correo !== Correo)
        return res.status(404).json({ valid: false, Error: "Correo Erroneo" });
    return res.status(200).json({ valid: true })
}


module.exports = {
    Registrarse,
    RegistrarseAdmin,
    Login,
    EnviarCorreo,
    LoginAdmin,
    ObtenerAdmins,
    EliminarAdmin,
    CrearUsuariosIniciales,
    UsuarioValido
};