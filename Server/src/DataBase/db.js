
// ---> Utilizamos la Dependencia sqlite3
const SQLite = require('sqlite3')

// ---> Utilizamos "PATH" para indicar ubicacion
const path= require('path')

// ---> Ubicación de la Base de Datos
const dbUbicacion = path.resolve(__dirname,'./Sistema.db')

function CrearTablas(db)
{
    db.run(`
        CREATE TABLE IF NOT EXISTS Usuarios(
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            User TEXT UNIQUE,
            Password TEXT,
            Name TEXT
        )
    `, (Error)=>{
        if(Error)
            console.log("❗ La tabla de Usuario no se creo.");
        else
            console.log("✅ Tabla Usuarios Creada Correctamente");
    })
}

const db = new SQLite.Database(dbUbicacion, (Error)=>{
    if(Error)
        console.error('No se Pudo Crear la Base de Datos ⛔')
    else
    {
        console.log('✅ Base de Datos Creada')
        CrearTablas(db);
    }
})

module.exports=db;
