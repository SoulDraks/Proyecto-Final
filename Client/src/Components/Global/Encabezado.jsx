import { useState } from "react"
// import { VscAccount } from "react-icons/icons"

function Encabezado() {
  const [User, setUser] = useState()
  const [Password, setPassword] = useState()
  const [Name, setName] = useState()

  const [Mensaje, setMensaje] = useState('')

  const RegistroSubmit = async (e) => {
    e.preventdefault();
    setMensaje('')
    try {
      const Server = await axios.post('http://localhost:3000/api/registrarusuario', {
        User,
        Password,
        Name
      })
      setMensaje(Server.data.Mensaje)
      console.log(Server.data.Mensaje)
      setUser('')
      setName('')
      setPassword('')
    }
    catch (Error) {
      console.log(Error)
    }
  }
  return (
    <>
      <header className='encabezado'>
        <nav className='menu'>
          <a href="">Login</a>
          <a href="">Registrar Usuario</a>
          <a href="">Eliminar Usuario</a>
        </nav>
      </header>

      <form onSubmit={RegistroSubmit}>
        <h1>Registro de Usuario:</h1>
        <label htmlFor="">Usuario        </label>
        <input type="text" name="User" id="User" required
          value={User} onChange={(e) => setUser(e.target.value)} />

        <label htmlFor="">Contraseña:</label>
        <input type="text" name="Password" id="Password" required
          value={Password} onChange={(e) => setPassword(e.target.value)} />

        <label htmlFor="">Nombre:</label>
        <input type="text" name="Name" id="Name" required
          value={Name} onChange={(e) => setName(e.target.value)} />

        <input type="submit" value="Registrar" />

      </form>

      <h1>{Mensaje}</h1>
    </>
  )
}

export default Encabezado