import { useState } from "react"
import axios from "axios"


function Login() {
    const[User,setUser]=useState('')
    const[Password,setPassword]=useState('')
    const[Mensaje,setMensaje]=useState('')

    const LoginSubmit=async(e)=>{
        e.preventDefault()
        setMensaje('')
        try{
            const server= await axios.post()
        }
        catch(error){

        }
    }
  return (
    <>
    <form onSubmit={LoginSubmit}>

        <label htmlFor="">Usuario:</label>
        <input type="text" name="User"  id="User" />

        <label htmlFor="">Contraseña:</label>
        <input type="password" name="Password" id="Password" />

        <input type="submit" value="Login" />
    </form>
    
    </>
  )
}

export default Login