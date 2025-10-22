const db = require("../DataBase/db")
const {CompararPassword, EncriptarPassword} = require("../Utils/Hash");

async function RegistroUsuario(req, res) {
    const {User, Password, Name} = req.body;
    if(!User || !Password || !Name)
    {
        console.error("Campos vacios");
        return res.status(404).json({Error: "Debe completar los datos para continuar"});
    }
    query = "SELECT * FROM Usuario WHERE User = ?"
    db.get(query, [User], async(Error, Tabla)=>{
        if(Error){
            console.log("Error en la Consulta.");
            return res.status(500).json({Error: "Error del Servidor"});
        }
        if(Tabla)
        {
            console.log("Usuario Existente");
            return res.status(201).json({Error: "Usuario Existente"});
        }
        const hash = await EncriptarPassword(Password);
        const query2 = "INSERT INTO Usuarios(User, Password, Name) VALUES(?, ?, ?)";
        db.run(query2, [User, hash, Name], async()=>{
            if(Error)
            {
                console.log("Error en la Consulta: ", Error);
                return res.status(500).json({Error: "Error en Servidor"});
            }
            else
            {
                return res.status(201).json({
                    Mensaje: "Usuario Registrado",
                    id: this.lastID,
                    User
                });
            }
        });
    });
}

async function Login(req, res)
{
    const {User, Password} = req.body;
    const query = "SELECT * FROM Usuarios WHERE User=?";
    db.get(query, [User], async(Error, Tabla)=>{
        if(Error)
        {
            console.error("✖ Error en Server");
            return res.status(500).json({Error: "Error en Server o Query"});
        }
        if(Tabla)
        {
            console.log("Usuario Existente.");
            return res.status(401).json({Error: "Usuario Existente"});
        }
        if(!User || !Password){
            console.log("✖ Campos Vacios");
            return res.status(401).json({Error: "Campos Vacios"});
        }
        // --------------------> BODY (REACT), BASE DE DATOS
        const hashed = await CompararPassword(Password. Tabla.Password);

        res.json({
            mensaje: "Bienvenido",
            User
        })
    });
}

module.exports = {RegistroUsuario, Login}