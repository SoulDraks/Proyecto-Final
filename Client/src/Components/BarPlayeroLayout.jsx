import './BarPlayeroStyles.css'
import DrinkCard from './Bebidas/DrinkCard'
import Cart from './Cart/Cart'
import CartButton from './Cart/CartButton'
import PromotionCarousel from './Promotions/PromotionCarousel'
import Login from './Login/Login'
import { useCart } from '../Context/CartContext'
import { useAuth } from '../Context/AuthContext'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.jpg'
import axios from "axios"
import { useState, useEffect } from 'react'

function BarPlayeroLayout() {
  const { addToCart, clearCart, updateQuantity } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  // Datos de productos con stock
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [cartMsg, setCartMsg] = useState(null)
  // Cargar productos
  useEffect(() => {
    axios.get("http://localhost:3000/api/obtenerproductos")
      .then(res => {
        const lista = res.data.map(p => ({
          id: p.Id,
          title: p.Nombre,
          image: "data:image/png;base64," + p.Imagen,
          price: "$" + p.Precio,
          description: p.Descripcion,
          stock: p.Stock,
          raw: p
        }));
        setProducts(lista);
      });
  }, []);
  // Cargar promos
  useEffect(() => {
    axios.get("http://localhost:3000/api/obtenerpromos")
      .then(res => {
        const lista = res.data.map(p => ({
          title: p.Nombre,
          image: "data:image/png;base64," + p.Imagen,
          description: p.Descripcion,
          newPrice: "$" + p.Precio,
        }));
        setPromotions(lista);
      });
  }, []);
  useEffect(() => {
    if (!user || !user.Id)
      return
    axios.post('http://localhost:3000/api/obtenercarrito', { ID_Cliente: user.Id })
      .then(res => {
        const serverItems = res.data || []
        clearCart()
        serverItems.forEach(item => {
          const productFromServer = {
            title: item.ProductoNombre || `Producto ${item.ID_Producto}`,
            image: item.ProductoImagen ? `data:image/png;base64,${item.ProductoImagen}` : '',
            price: "$" + (item.ProductoPrecio ?? "0"),
            description: item.ProductoDescripcion ?? '',
            stock: item.Stock ?? 9999,
            raw: { ID: item.ID_Producto }
          }
          // Añadimos una vez y luego seteamos la cantidad real
          addToCart(productFromServer)
          // updateQuantity espera el título (coincide con lo que usamos arriba)
          if (item.Cantidad > 1) {
            updateQuantity(productFromServer.title, item.Cantidad)
          }
        })
      })
  }, [user]); // corre cuando user cambie

  const handleAddToCart = async (product) => {
    if (user && user.Id) {
      try {
        console.log(user);
        console.log(product.raw.ID)
        await axios.post('http://localhost:3000/api/anadirprodcarrito', {
          ID_Cliente: user.Id,
          ID_Producto: product.raw?.ID ?? product.raw?.id ?? null
        })
        // opción: mostrar mensaje corto
        setCartMsg('Producto añadido al carrito (servidor)')
        setTimeout(() => setCartMsg(null), 2000)
        addToCart(product)
      } catch (err) {
        console.error("Error añadiendo producto al carrito en servidor:", err)
        setTimeout(() => setCartMsg(null), 2500)
      }
    } else {
      setCartMsg('Producto añadido al carrito (local)')
      setTimeout(() => setCartMsg(null), 1600)
      addToCart(product)
    }
  }

  return (
    <div className="layout">
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      <CartButton />
      <Cart />

      <header className="encabezado">
        <img src={Logo} alt="Bar Playero Logo" className="logo-image" />
        <nav className="menu">
          <a href="#">Cocteles</a>
          <a href="#">Cervezas</a>
          <a href="#">Bebidas</a>
          <a href="#">Contacto</a>
        </nav>
        <div className="user-actions">
          {user ? (
            <>
              <span className="user-name">Hola, {user.Nombre}</span>
              {isAdmin && (
                <Link to="/admin" className="admin-link">Admin</Link>
              )}
              <button className="logout-btn" onClick={logout}>Cerrar Sesión</button>
            </>
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <section className="intermedio">
        <div className="hero-banner">
          <h2>BIENVENIDOS AL BAR PLAYERO</h2>
          <p>Disfruta de los mejores momentos junto al mar</p>
          <div className="hero-info">
            <p>El bar más vibrante y alegre de la costa</p>
            <p>Desde 1990, ofrecemos experiencias únicas con ambiente de playa y energía positiva</p>
          </div>
        </div>
      </section>

      <PromotionCarousel promotions={promotions} />

      <main className="contenido">
        <h2 className="products-title">NUESTRO MENÚ</h2>
        <div className="cards">
          {products.map(product => (
            <DrinkCard
              key={product.title + (product.raw?.ID ?? '')}
              title={product.title}
              image={product.image}
              price={product.price}
              description={product.description}
              stock={product.stock}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default BarPlayeroLayout

