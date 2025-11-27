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
import axios from "axios"
import { useState, useEffect} from 'react'

function BarPlayeroLayout() {
  const { addToCart } = useCart()
  // Datos de productos con stock
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  // Cargar productos
  useEffect(() => {
    axios.get("http://localhost:3000/api/obtenerproductos")
      .then(res => {
        const lista = res.data.map(p => ({
          title: p.Nombre,
          image: "data:image/png;base64," + p.Imagen,
          price: p.Precio,
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
          name: p.Nombre,
          price: p.Precio,
          image: "data:image/png;base64," + p.ImagenPromo
        }));
        setPromotions(lista);
      });
  }, []);
  /*DDDDDDDDDDDD
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
  */

  // Promociones especiales
  axios.get("http://localhost:3000/api/obtenerpromos")
    .then(res => {
      const Promos = res.data;
      console.log(Promos.length);
      Promos.map((Promo) => {
        promotions.push({
          name: Promo.NombrePromo,
          newPrice: "$" + Promo.PrecioPromo,
          image: "data:image/png;base64," + Promo.ImagenPromo,
          description: Promo.DescripcionPromo
        });
      })
    });

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
          {products.map(product => (
            <DrinkCard
              key={product.title}
              title={product.title}
              image={product.image}
              price={product.price}
              description={product.description}
              stock={product.stock}
              onAddToCart={() => addToCart(product.raw)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
/*
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
*/

export default BarPlayeroLayout

