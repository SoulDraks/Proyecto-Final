const db = require("../DataBase/db")
const {CompararPassword, EncriptarPassword} = require("../Utils/Hash");
async function Login(req, res)
{
    const {User, Password} = req.body;
    const query = "SELECT * FROM Usuarios WHERE User=?";
    db.get(query, [User], (Error, Tabla)=>{
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
        const hashed = CompararPassword(Password. Tabla.Password);
    });
}
