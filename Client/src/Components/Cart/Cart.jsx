import { useCart } from '../../Context/CartContext'
import { useAuth } from '../../Context/AuthContext'
import axios from 'axios'
import './Cart.css'

function Cart() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart()

  const { user } = useAuth()

  if (!isCartOpen) return null

  const handleIncrease = async (item) => {
    if (user && user.Id) {
      const userId = user.Id
      const productId = item.raw?.ID ?? item.raw?.id ?? null
      if (!productId) {
        updateQuantity(item.title, item.quantity + 1)
        return
      }
      try {
        await axios.post('http://localhost:3000/api/anadirprodcarrito', {
          ID_Cliente: userId,
          ID_Producto: productId
        })
        updateQuantity(item.title, item.quantity + 1)
      } catch(err) {
        console.error('Error al aumentar cantidad en servidor:', err)
        updateQuantity(item.title, item.quantity + 1)
      }
    }
  }
  const handleDecrease = async (item) => {
    if (user && user.Id) {
      const userId = user.Id
      const productId = item.raw?.ID ?? item.raw?.id ?? null
      if (!productId) {
        if (item.quantity > 1) updateQuantity(item.title, item.quantity - 1)
        else removeFromCart(item.title)
        return
      }
      try {
        // servidor decide si disminuye o elimina según cantidad
        await axios.post('http://localhost:3000/api/eliminarprodcarrito', {
          ID_Cliente: userId,
          ID_Producto: productId
        })
        if (item.quantity > 1)
          updateQuantity(item.title, item.quantity - 1)
        else
          removeFromCart(item.title)
      } catch(err)
      {
        console.error('Error al disminuir cantidad en servidor:', err)
      }
    }
  }

  const handleRemove = async (item) => {
    if (user && user.Id ) {
      const userId = user.Id
      const productId = item.raw?.ID ?? item.raw?.id ?? null
      try
      {
        if (productId) {
          await axios.post('http://localhost:3000/api/eliminarprodcarrito', {
            ID_Cliente: userId,
            ID_Producto: productId,
            Eliminar: true
          })
        }
        removeFromCart(item.title)
      } catch (err) {
        console.error('Error al eliminar producto en servidor:', err)
        removeFromCart(item.title)
      }
    } else {
      removeFromCart(item.title)
    }
  }

  const handleClearCart = async() => {
    if (user && user.Id) {
      try
      {
        await axios.post('http://localhost:3000/api/vaciarcarrito', {
          ID_Cliente: user.Id
        });
      }
      catch(err) {
        return console.error("Error al intentar vaciar el carrito: ", err);
      }
    }
    clearCart();
  }

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Carrito de Compras</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            ×
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.title} className="cart-item">
                    <img src={item.image} alt={item.title} className="cart-item-image" />
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <p className="cart-item-price">{item.price}</p>
                      <div className="cart-item-controls">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrease(item)}
                          disabled={item.quantity >= item.stock}
                          className="quantity-btn"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemove(item)}
                          className="remove-btn"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ${Number(getTotalPrice() || 0).toFixed(2)}</strong>
                </div>
                <div className="cart-actions">
                  <button onClick={handleClearCart} className="btn-clear">
                    Vaciar Carrito
                  </button>
                  <button className="btn-checkout">Finalizar Compra</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart
