const db = require("../DataBase/db");
const { CompararPassword, EncriptarPassword } = require("../Utils/Hash");

function dbGet(query, params)
{
    return new Promise((resolve, reject) => {
        db.get(query, params, (Error, Datos) => {
            if(Error)
            {
                console.error("✖ Error en Query", err);
                reject(Error);
            }
            else
                resolve(Datos);
        });
    });
}

function dbAll(query, params)
{
    return new Promise((resolve, reject) => {
        // Lo mismo que arriba pero siendo un array
        params = params || [];
        db.all(query, params, (Error, Datos) => {
            if(Error)
            {
                console.error("✖ Error en Query", Error);
                reject(Error)
            }
            else
                resolve(Datos);
        });
    })
}

function dbRun(query, params)
{
    return new Promise((resolve, reject) => {
        db.run(query, params, (Error) => {
            if(Error)
            {
                console.error("✖ Error en Query", Error);
                reject(Error);
            }
            else
                resolve(false);
        });
    })
}

async function ClienteExiste(ID)
{
    const query = "SELECT * FROM Cliente WHERE ID = ?";
    const Cliente = await dbGet(query, [ID]);
    return Cliente != false;
}

async function ProductoExiste(ID)
{
    const query = "SELECT * FROM Productos WHERE ID = ?";
    const Producto = await dbGet(query, [ID]);
    return Producto != false;
}

async function PromoExiste(ID)
{
    const query = "SELECT * FROM Promos WHERE ID = ?";
    const Promo = await dbGet(query, [ID]);
    return Promo != false;
}

// Para registrar un nuevo cliente
async function Registrarse(req, res)
{
    const {Nombre, Correo, Contraseña} = req.body;
    if(!Nombre || !Correo || !Contraseña)
        return res.status(400).json({Error: "Faltan datos (Nombre, Correo o Contraseña)"});
    const Existe = await dbGet(`SELECT * FROM Cliente WHERE Nombre = ?`, [Nombre]);
    if(Existe)
        return res.status(409).json({Error: "Nombre de usuario ya existente"});
    const Hash = EncriptarPassword(Contraseña);
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
async function RegistrarseAdmin(req, res)
{
    const {Nombre, Correo, Contraseña} = req.body;
    if(!Nombre || !Correo || !Contraseña)
        return res.status(400).json({Error: "Faltan datos (Nombre, Correo o Contraseña)"});
    const Existe = await dbGet(`SELECT * FROM Empleado WHERE Nombre = ?`, [Nombre]);
    if(Existe)
        return res.status(409).json({Error: "Nombre de empleado ya existente"});
    const Hash = EncriptarPassword(Contraseña);
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
async function Login(req, res)
{
    const {Nombre, Contraseña} = req.body;
    if(!Nombre || !Contraseña)
        return res.status(400).json({Error: "Campos vacíos"})
    const query = `SELECT * FROM Cliente WHERE Nombre = ?`;
    const Cliente = await dbGet(query, [Nombre]);
    if(!Cliente) 
        return res.status(401).json({Error: "Usuario inexistente"});
    const Hashed = CompararPassword(Password. Tabla.Password);
    if(!Hashed)
        return res.status(401).json({Error: "Contraseña incorrecta"});
    return res.status(200).json({
        Mensaje: "Login exitoso", 
        Cliente
    });
}

// Para que se loguee el empleado/admin
// Devuelve de la misma manera que Login pero con Empleado
async function LoginAdmin(req, res)
{
    const {Nombre, Contraseña} = req.body;
    if(!Nombre || !Contraseña)
        return res.status(400).json({Error: "Campos vacíos"});
    const Empleado = await dbGet(`SELECT * FROM Empleado WHERE Nombre = ?`, [Nombre]);
    if(!Empleado)
        return res.status(401).json({Error: "Empleado inexistente"});
    const Hashed = CompararPassword(Contraseña, emp.Contraseña);
    if(!Hashed)
        return res.status(401).json({Error: "Contraseña incorrecta"});
    return res.status(200).json({
        Mensaje: "Login admin exitoso",
        Empleado
    });
}

async function ObtenerProductos(req, res)
{
    const query = "SELECT * FROM Productos";
    Productos = await dbAll(query);
    console.log(Productos);
    if(!Productos)
        return res.status(500).json({Error: "Error en Server o Query"});
    Productos.map((Producto) => {
        Producto.Imagen = Producto.Imagen.toString("base64");
    });
    return res.status(201).json(Productos);
}

async function ObtenerPromos(req, res)
{
    const query = `
        SELECT Productos.*, Promos.Nombre AS NombrePromo, Promos.Precio AS PrecioPromo, Promos.Imagen AS ImagenPromo, Promos.Descripcion AS DescripcionPromo
        FROM Productos
        JOIN Promos ON Productos.ID_Promo = Promos.ID
        WHERE Productos.ID_Promo != -1
    `;
    Promos = await dbAll(query);
    if(!Promos)
        return res.status(500).json({Error: "Error en Server o Query"});
    Promos.map((Promo) => {
        Promo.ImagenPromo = Promo.ImagenPromo.toString("base64");
    })
    return res.status(201).json(Promos);
}

// Obtiene el Carrito de un cliente :D
/*
    Devuelve los datos en un array asi:
    [
        {
            "ID_Carrito": 1,
            "ID_Producto": 5,
            "ProductoNombre": "Whisky",
            "ProductoPrecio": 1200,
            "ProductoDescripcion": "Un buen whisky",
            "ProductoImagen": AlgunaImagen.png
            "Cantidad": 2,
            "ID_Promo": -1,
            "PromoNombre": null,
            "PromoPrecio": null
        },
        {
            "ID_Carrito": 2,
            "ID_Producto": -1,
            "ProductoNombre": null,
            "ProductoPrecio": null,
            "ProductoDescripcion": null,
            "Cantidad": 1,
            "ID_Promo": 3,
            "PromoNombre": "Combo Alcohilo XD",
            "PromoPrecio": 9999
        }
    ]
    Si queres saber si un elemento es producto o promo, solo compara si ID_Promo == -1.
    por ejemplo:
    const Carrito = await axios.post("http://localhost:3000/api/ObtenerCarrito", {ClienteID});
    Carrito.data.forEach((Item) => {
        if(Item.ID_Promo == -1)
            console.log("Es un producto:", Item.ProductoNombre);
        else
            console.log("Es una promo:", Item.PromoNombre);
    });
}
*/
async function ObtenerCarrito(req, res)
{
    const {ID_Cliente} = req.body;
    if(!ID_Cliente)
        return res.status(400).json({Error: "Falta ID del cliente"});
    const query = `
        SELECT
            Carrito.ID AS ID_Carrito,
            Carrito.ID_Producto,
            Productos.Nombre AS ProductoNombre,
            Productos.Precio AS ProductoPrecio,
            Productos.Imagen AS ProductoImagen,
            Productos.Descripcion AS ProductoDescripcion,
            Carrito.Cantidad,
            Carrito.ID_Promo,
            Promos.Nombre AS PromoNombre,
            Promos.Precio AS PromoPrecio
        FROM Carrito
        LEFT JOIN Productos ON Carrito.ID_Producto = Productos.ID
        LEFT JOIN Promos ON Carrito.ID_Promo = Promos.ID
        WHERE Carrito.ID_Cliente = ?
    `;
    const Carrito = await dbAll(query, [ID_Cliente]);
    Carrito.map((Item) => {
        Item.ProductoImagen = Item.ProductoImagen.toString("base64");
    })
    return res.status(200).json(Carrito);
}

// Añade un producto al carrito del cliente
async function AñadirProdCarrito(req, res)
{
    const {ID_Cliente, ID_Producto} = req.body;
    if(!ID_Cliente || !ID_Producto)
        return res.status(400).json({Error: "Faltan ID_Cliente o ID_Producto"});
    // Verificamos si Cliente y Producto existen
    if(!await ClienteExiste(ID_Cliente))
        return res.status(404).json({Error: "Cliente inexistente", ID_Cliente});
    if(!await ProductoExiste(ID_Producto))
        return res.status(404).json({Error: "Producto inexistente", ID_Producto});
    // Verificamos si el producto ya esta en el carrito
    query = `
        SELECT * FROM Carrito 
        WHERE ID_Producto = ? AND ID_Cliente = ?
    `;
    const Item = await dbGet(query, [ID_Producto, ID_Cliente]);
    if(Item)
    {
        // Si ya existe, solo aumentamos la cantidad
        const nuevaCantidad = Item.Cantidad + 1;
        query = `
            UPDATE Carrito SET Cantidad = ?
            WHERE ID = ?
        `;
        await dbRun(query, [nuevaCantidad, Item.ID]);
    }
    else
    {
        // Si no existe, lo insertamos con cantidad 1
        query = `
            INSERT INTO Carrito(ID_Producto, ID_Promo, ID_Cliente, Cantidad) 
            VALUES (?, -1, ?, 1)
        `;
        await dbRun(query, [ID_Producto, ID_Cliente]);
    }
    return res.status(201).json({Mensaje: "Producto añadido al carrito"});
}

// Elimina un producto del carrito del cliente
// Si el producto tiene cantidad > 1, solo disminuye la cantidad
// Si la cantidad es 1, elimina el producto del carrito
// Si vos envias Eliminar=true en el body, elimina el producto sin importar la cantidad
async function EliminarProdCarrito(req, res)
{
    const {ID_Cliente, ID_Producto, Eliminar} = req.body;
    if(!ID_Carrito || !ID_Cliente)
        return res.status(400).json({Error: "Faltan ID_Carrito o ID_Cliente"});
    if(!ClienteExiste(ID_Cliente))
        return res.status(404).json({Error: "Cliente inexistente"});
    if(!ProductoExiste(ID_Producto))
        return res.status(404).json({Error: "Producto inexistente"});
    let query = `
        SELECT * FROM Carrito 
        WHERE ID_Producto = ? AND ID_Cliente = ?
    `;
    const Item = await dbGet(query, [ID_Producto, ID_Cliente]);
    if(!Item)
        return res.status(404).json({Error: "El cliente no tiene ese producto en el carrito"});
    if(Item.Cantidad > 1 && !Eliminar)
    {
        // Si la cantidad es mayor a 1, solo disminuimos la cantidad
        const nuevaCantidad = Item.Cantidad - 1;
        query = `
            UPDATE Carrito SET Cantidad = ?
            WHERE ID = ?
        `;
        await dbRun(query, [nuevaCantidad, Item.ID]);
        return res.status(200).json({Mensaje: "Cantidad de producto disminuida"});
    }
    else
    {
        // Si la cantidad es 1 o 'Eliminar' es verdadero, eliminamos el item del carrito
        query = "DELETE FROM Carrito WHERE ID = ?";
        await dbRun(query, [Item.ID]);
        return res.status(200).json({Mensaje: "Producto eliminado del carrito"});
    }
}

// Añade una promo al carrito del cliente
async function AñadirPromCarrito(req, res)
{
    const {ID_Cliente, ID_Promo} = req.body;
    if(!ID_Cliente || !ID_Promo)
        return res.status(400).json({Error: "Faltan ID_Cliente o ID_Promo"});
    if(!await ClienteExiste(ID_Cliente))
        return res.status(404).json({Error: "Cliente inexistente", ID_Cliente});
    if(!await PromoExiste(ID_Promo))
        return res.status(404).json({Error: "Promo inexistente", ID_Promo});
    // Verificar si ya esta en carrito
    let query = `
        SELECT * FROM Carrito
        WHERE ID_Promo = ? AND ID_Cliente = ?
    `;
    const Item = await dbRun(query, [ID_Promo, ID_Cliente]);
    if(Item)
    {
        const nuevaCantidad = Item.Cantidad + 1;
        query = `
            UPDATE Carrito SET Cantidad = ?
            WHERE ID = ?
        `;
        await dbRun(query, [nuevaCantidad, Item.ID]);
    }
    else
    {
        query = `
            INSERT INTO Carrito(ID_Producto, ID_Promo, ID_Cliente, Cantidad) 
            VALUES (-1, ?, ?, 1)
        `;
        await dbRun(query, [ID_Promo, ID_Cliente]);
    }
    return res.status(201).json({Mensaje: "Promo añadido al carrito"});
}

// Elimina una promo del carrito del cliente
// Si la promo tiene cantidad > 1, solo disminuye la cantidad
// Si la cantidad es 1, elimina la promo del carrito
// Si vos envias Eliminar=true en el body, elimina la promo sin importar la cantidad
// No se para que repito pero ante la duda lo dejo :D
async function EliminarPromCarrito(req, res)
{
    const {ID_Cliente, ID_Promo, Eliminar} = req.body;
    if(!ID_Carrito || !ID_Cliente)
        return res.status(400).json({Error: "Faltan ID_Carrito o ID_Cliente"});
    if(!await ClienteExiste(ID_Cliente))
        return res.status(404).json({Error: "Cliente inexistente"});
    if(!await PromoExiste(ID_Producto))
        return res.status(404).json({Error: "Promo inexistente"});
    let query = `
        SELECT * FROM Carrito 
        WHERE ID_Promo = ? AND ID_Cliente = ?
    `;
    const Item = await dbGet(query, [ID_Promo, ID_Cliente]);
    if(!Item)
        return res.status(404).json({Error: "El cliente no tiene esa promo en el carrito"});
    if(Item.Cantidad > 1 && !Eliminar)
    {
        const nuevaCantidad = Item.Cantidad - 1;
        query = `
            UPDATE Carrito SET Cantidad = ?
            WHERE ID = ?
        `;
        await dbRun(query, [nuevaCantidad, Item.ID]);
        return res.status(200).json({Mensaje: "Cantidad de promo disminuida"});
    }
    else
    {
        query = "DELETE FROM Carrito WHERE ID = ?";
        await dbRun(query, [Item.ID]);
        return res.status(200).json({Mensaje: "Promoeliminado del carrito"});
    }
}

// Añade un nuevo producto a la base de datos
async function AñadirProducto(req, res)
{
    const {Nombre, Precio, Stock, Descripcion} = req.body;
    const ID_Promo = req.body.ID_Promo || -1; // Si no se envia, se pone -1, osea, sin promo
    const Imagen = req.file ? req.file.buffer : null;
    if (!Nombre || !Precio || !Imagen || !Stock, !Descripcion)
        return res.status(400).json({Error: "Faltan datos"});
    const query = `
        INSERT INTO Productos (Nombre, Precio, Imagen, Stock, Descripcion, ID_Promo)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const Error = await dbRun(query, [Nombre, Precio, Imagen, Stock, Descripcion, ID_Promo]);
    console.log(Error)
    if(Error)
        return res.status(500).json({Error: "Error en Servidor"});
    return res.status(201).json({
        Mensaje: "Producto añadido",
        Nombre, Precio, Stock
    });
}

// Modifica un producto en la base de datos (un poco obvio lo se XD)
async function ModificarProducto(req, res)
{
    const {ID, Nombre, Precio, Stock, Descripcion, ID_Promo} = req.body;
    const Imagen = req.file ? req.file.buffer : null;
    if (!ID, !Nombre || !Precio || !Stock || !Descripcion || !ID_Promo || !Imagen)
        return res.status(400).json({Error: "Faltan datos"});
    if(!await ProductoExiste(ID))
        return res.status(404).json({Error: "Producto inexistente"});
    const query = `
        UPDATE Productos
        SET Nombre = ?, Precio = ?, Imagen = ?, Stock = ?, Descripcion = ?, ID_Promo = ?
        WHERE ID = ?
    `;
    const Error = await dbRun(query, [Nombre, Precio, Imagen, Stock, Descripcion, ID_Promo, ID]);
    if(Error)
        return res.status(500).json({Error: "Error en Servidor"});
    return res.status(201).json({
        Mensaje: "Producto modificado",
        Nombre, Precio, Stock
    });
}

// Elimina un producto de la base de datos
async function EliminarProducto(req, res)
{
    const {ID} = req.body;
    if(!ID)
        return res.status(400).json({Error: "Falta ID"});
    const Producto = dbGet(`SELECT * FROM Productos WHERE ID = ?`, [ID]);
    if(!Producto)
        return res.status(404).json({ Error: "Producto inexistente"});
    // Borrar referencias en Carrito
    await dbRun(`DELETE FROM Carrito WHERE ID_Producto = ?`, [ID]);
    await dbRun(`DELETE FROM Productos WHERE ID = ?`, [ID]);
    return res.status(200).json({Mensaje: "Producto eliminado", ProductoID: ID});
}

// Añade una promo a la base de datos (dah 🙄)
async function AñadirPromo(req, res) {
    const { Nombre, Precio } = req.body;
    const Imagen = req.file ? req.file.buffer : null;
    if (!Nombre || !Precio || !Imagen)
        return res.status(400).json({Error: "Faltan datos"});
    const query = `INSERT INTO Promos (Nombre, Precio, Imagen) VALUES (?, ?, ?)`;
    const Error = await dbRun(query, [Nombre, Precio, Imagen]);
    if(Error)
        return res.status(500).json({Error: "Error en Servidor"});
    return res.status(201).json({Mensaje: "Promo añadida", Nombre, Precio});
}

// Modifica una promo de la base de datos (cuantas veces tendre que hacer esto? XD)
async function ModificarPromo(req, res)
{
    const {ID, Nombre, Precio} = req.body;
    const Imagen = req.file ? req.file.buffer : null;
    if(!ID || !Nombre || !Precio || !Imagen)
        return res.status(400).json({Error: "Faltan datos"});
    if(!await PromoExiste(ID))
        return res.status(404).json({ Error: "Promo inexistente" });
    const query = `
        UPDATE Promos
        SET Nombre = ?, Precio = ?, Imagen = ?
        WHERE ID = ?`;
    const Error = await dbRun(query, [Nombre, Precio, Imagen, ID]);
    if(Error)
        return res.status(500).json({ Error: "Error en Servidor" });
    return res.status(200).json({ Mensaje: "Promo modificada", PromoID: ID, Nombre, Precio });
}

// Elimina una promo de la base de datos
async function EliminarPromo(req, res)
{
    const {ID} = req.body;
    if(!ID)
        return res.status(400).json({Error: "Falta ID"});
    const Promo = dbGet(`SELECT * FROM Promos WHERE ID = ?`, [ID]);
    if(!Promo)
        return res.status(404).json({ Error: "Promo inexistente"});
    // Borrar referencias en Carrito
    await dbRun(`DELETE FROM Carrito WHERE ID_Promo = ?`, [ID]);
    await dbRun(`DELETE FROM Promos WHERE ID = ?`, [ID]);
    return res.status(200).json({Mensaje: "Promo eliminada", PromoID: ID});
}

module.exports = {
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
};