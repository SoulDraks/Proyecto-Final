import './BarPlayeroStyles.css'
import DrinkCard from './Bebidas/DrinkCard'
import Cart from './Cart/Cart'
import CartButton from './Cart/CartButton'
import PromotionCarousel from './Promotions/PromotionCarousel'
import { useCart } from '../Context/CartContext'
import Logo from '../assets/logo.jpg'
import Margarita from '../assets/Margarita.jpg'
import Mojito from '../assets/mojito.jpg'
import GinTonic from '../assets/gin_tonic.jpg'
import PiñaColada from '../assets/piña_colada.jpg'
import Manhattan from '../assets/Manhattan.jpg'
import Caipirinha from '../assets/Caipirinha.jpg'
import CubaLibre from '../assets/Cuba_libre.jpg'
import Daiquiri from '../assets/Daiquiri.jpg'
import Cerveza from '../assets/cerveza.jpg'
import Vino from '../assets/vino.jpg'
import Whisky from '../assets/Whisky.jpg'
import FernetConCola from '../assets/Fernet_con_cola.jpg'

function BarPlayeroLayout() {
  const { addToCart } = useCart()

  // Datos de productos con stock
  const products = [
    { title: "Margarita", image: Margarita, price: "$13", description: "Tequila, triple seco y jugo de lima o limón, servido en un vaso con sal en el borde.", stock: 15 },
    { title: "Mojito", image: Mojito, price: "$12", description: "Ron, azúcar, menta, jugo de lima y agua con gas o gaseosa.", stock: 20 },
    { title: "Gin Tonic", image: GinTonic, price: "$11", description: "Ginebra y tónica.", stock: 18 },
    { title: "Piña Colada", image: PiñaColada, price: "$14", description: "Ron, crema de coco y piña.", stock: 12 },
    { title: "Manhattan", image: Manhattan, price: "$15", description: "Whisky y vermut rojo.", stock: 10 },
    { title: "Caipirinha", image: Caipirinha, price: "$12", description: "Cachaça, lima, azúcar y hielo.", stock: 16 },
    { title: "Cuba Libre", image: CubaLibre, price: "$9", description: "Ron, refresco de cola y limón.", stock: 25 },
    { title: "Daiquiri", image: Daiquiri, price: "$11", description: "Ron, jugo de limón y azúcar.", stock: 14 },
    { title: "Cerveza", image: Cerveza, price: "$8", description: "Una opción muy popular en barras de todo el mundo.", stock: 50 },
    { title: "Vino", image: Vino, price: "$10", description: "Otra opción básica y común.", stock: 30 },
    { title: "Whisky", image: Whisky, price: "$18", description: "Se consume solo, en las rocas o en cócteles como el Manhattan y el Old Fashioned.", stock: 8 },
    { title: "Fernet con Cola", image: FernetConCola, price: "$10", description: "Un trago icónico en Argentina, servido con mucho hielo.", stock: 22 },
  ]

  // Promociones especiales
  const promotions = [
    {
      title: "2x1 en Mojitos",
      description: "Aprovecha esta increíble promoción: compra 2 mojitos y paga solo 1. Perfecto para compartir con amigos.",
      image: Mojito,
      oldPrice: "$24",
      newPrice: "$12",
      discount: "50% OFF"
    },
    {
      title: "Combo Piña Colada + Margarita",
      description: "Disfruta de dos de nuestros cócteles más populares con un descuento especial. Ideal para una noche tropical.",
      image: PiñaColada,
      oldPrice: "$27",
      newPrice: "$20",
      discount: "26% OFF"
    },
    {
      title: "Happy Hour Cervezas",
      description: "De 18:00 a 20:00, todas las cervezas con un 30% de descuento. ¡No te lo pierdas!",
      image: Cerveza,
      oldPrice: "$8",
      newPrice: "$5.60",
      discount: "30% OFF"
    }
  ]

  return (
    <div className="layout">
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
          {products.map((product) => (
            <DrinkCard 
              key={product.title}
              title={product.title} 
              image={product.image} 
              price={product.price} 
              description={product.description}
              stock={product.stock}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default BarPlayeroLayout

