const express= require('express')

const App= express()

const cors= require('cors')

App.use(cors())
App.use(express.json())

const Router = require('./src/Routers/Login.Router')
App.use('/api', Router)

require('dotenv').config()
const PORT = process.env.PORT || 5000

App.listen(PORT,()=>
{
    console.log(`🚀 http://localhost:${PORT}`)
})