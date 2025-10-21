import { VscAccount } from "react-icons/icons"

function Encabezado() {
  return (
    <>
    <header className='encabezado'>
        <h1>
          <mDAccountBox />
        </h1>
        <nav className='menu'>
            <a href="">Login</a>
            <a href="">Registrar Usuario</a>
            <a href="">Eliminar Usuario</a>
        </nav>
    </header>
    </>
  )
}

export default Encabezado