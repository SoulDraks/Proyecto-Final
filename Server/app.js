const express= require('express')

const App= express()

const cors= require('cors')

App.use(cors())
App.use(express.json())

const CarritoRoutes = require("./src/Routers/Carrito.Routes");
const LoginRoutes = require('./src/Routers/Login.Routes');
const ProductosRoutes = require("./src/Routers/Productos.Routes");
const MesasRoutes = require("./src/Routers/Mesas.Routes");
App.use('/api', LoginRoutes, CarritoRoutes, ProductosRoutes, MesasRoutes)

require('dotenv').config()
const PORT = process.env.PORT || 3000

App.listen(PORT,()=>
{
    console.log(`🚀 http://localhost:${PORT}`)
})