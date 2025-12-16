import { useCart } from '../../Context/CartContext'
import { useAuth } from '../../Context/AuthContext'
import axios from 'axios'
import { useState, useEffect } from 'react'
import './Cart.css'

function Cart({ onShowLogin }) {
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

  const { user, setProcesandoOrden } = useAuth();
  const [checkoutMsg, setCheckoutMsg] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false);
  // Para asegurar que no se presione varias veces el boton :D
  const [canBePressed, setCanBePressed] = useState(true);
  useEffect(() => {
    if (user)
      setIsProcessing(Boolean(user.ProcesandoOrden));
  }, [user]);

  if (!isCartOpen) return null

  const handleIncrease = async (item) => {
    if (!user || !user.Id) {
      setCheckoutMsg('Debes iniciar sesión para modificar el carrito')
      setTimeout(() => setCheckoutMsg(null), 3000)
      if (onShowLogin) onShowLogin()
      return
    }

    const userId = user.Id
    const productId = item.raw?.ID ?? item.raw?.id ?? null
    if (!productId) {
      updateQuantity(item.title, item.quantity + 1)
      return
    }
    try {
      console.log(item);
      if (!item.isPromo)
        await axios.post('http://localhost:3000/api/anadirprodcarrito', {
          ID_Cliente: userId,
          ID_Producto: productId
        })
      else
        await axios.post('http://localhost:3000/api/anadirpromcarrito', {
          ID_Cliente: userId,
          ID_Promo: productId
        })
      updateQuantity(item.title, item.quantity + 1)
    } catch (err) {
      console.error('Error al aumentar cantidad en servidor:', err)
      updateQuantity(item.title, item.quantity + 1)
    }
  }
  const handleDecrease = async (item) => {
    if (!user || !user.Id) {
      setCheckoutMsg('Debes iniciar sesión para modificar el carrito')
      setTimeout(() => setCheckoutMsg(null), 3000)
      if (onShowLogin) onShowLogin()
      return
    }

    const userId = user.Id
    const productId = item.raw?.ID ?? item.raw?.id ?? null
    if (!productId) {
      if (item.quantity > 1) updateQuantity(item.title, item.quantity - 1)
      else removeFromCart(item.title)
      return
    }
    try {
      // servidor decide si disminuye o elimina según cantidad
      if (!item.isPromo)
        await axios.post('http://localhost:3000/api/eliminarprodcarrito', {
          ID_Cliente: userId,
          ID_Producto: productId
        })
      else
        await axios.post('http://localhost:3000/api/eliminarpromcarrito', {
          ID_Cliente: userId,
          ID_Promo: productId
        })
      if (item.quantity > 1)
        updateQuantity(item.title, item.quantity - 1)
      else
        removeFromCart(item.title)
    } catch (err) {
      console.error('Error al disminuir cantidad en servidor:', err)
    }
  }

  const handleRemove = async (item) => {
    if (!user || !user.Id) {
      setCheckoutMsg('Debes iniciar sesión para modificar el carrito')
      setTimeout(() => setCheckoutMsg(null), 3000)
      if (onShowLogin) onShowLogin()
      return
    }

    const userId = user.Id
    const productId = item.raw?.ID ?? item.raw?.id ?? null
    try {
      if (productId) {
        if(!item.isPromo)
          await axios.post('http://localhost:3000/api/eliminarprodcarrito', {
            ID_Cliente: userId,
            ID_Producto: productId,
            Eliminar: true
          })
        else
          await axios.post('http://localhost:3000/api/eliminarpromcarrito', {
            ID_Cliente: userId,
            ID_Promo: productId,
            Eliminar: true
          })
      }
      removeFromCart(item.title)
    } catch (err) {
      console.error('Error al eliminar producto en servidor:', err)
      removeFromCart(item.title)
    }
  }

  const handleClearCart = async () => {
    if (!user || !user.Id) {
      setCheckoutMsg('Debes iniciar sesión para realizar esta acción')
      setTimeout(() => setCheckoutMsg(null), 3000)
      if (onShowLogin) onShowLogin()
      return
    }

    if (user && user.Id) {
      try {
        await axios.post('http://localhost:3000/api/vaciarcarrito', {
          ID_Cliente: user.Id
        });
      }
      catch (err) {
        return console.error("Error al intentar vaciar el carrito: ", err);
      }
    }
    clearCart();
  }

  const handleCheckout = async () => {
    if (!user || !user.Id) {
      setCheckoutMsg('Debes iniciar sesión para finalizar tu compra')
      setTimeout(() => setCheckoutMsg(null), 3000)
      if (onShowLogin) onShowLogin()
      return
    }

    if (cartItems.length === 0) {
      setCheckoutMsg('Tu carrito está vacío')
      setTimeout(() => setCheckoutMsg(null), 2000)
      return
    }

    try {
      await axios.post(`http://localhost:3000/api/realizarpedido`, {
        ID_Cliente: user.Id
      });
      setProcesandoOrden(1);
      setCheckoutMsg('¡Compra realizada con éxito!')
      setTimeout(() => {
        setIsProcessing(true);
        setCanBePressed(false);
        setCheckoutMsg(null)
        setIsCartOpen(false)
        setIsProcessing(true);
      }, 2000)
    } catch (err) {
      console.error('Error al procesar la compra:', err)
      setProcesandoOrden(0);
      setIsProcessing(false);
      setCanBePressed(true);
      setCheckoutMsg('Error al procesar la compra. Intenta nuevamente.')
      setTimeout(() => setCheckoutMsg(null), 3000)
    }
  }

  const handleCancelOrder = async () => {
    try {
      await axios.post("http://localhost:3000/api/cancelarpedido", {
        ID_Cliente: user.Id
      })
      setProcesandoOrden(0)
      setIsProcessing(false);
      setCanBePressed(true);
      setCheckoutMsg('Orden cancelada')
      setTimeout(() => setCheckoutMsg(null), 2000)
    }
    catch (error) {
      console.error('Error al procesar la compra:', err)
      setProcesandoOrden(1);
      setIsProcessing(true);
      setCanBePressed(false);
      setCheckoutMsg('Error al procesar la compra. Intenta nuevamente.')
      setTimeout(() => setCheckoutMsg(null), 3000)
    }
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

        <div className={`cart-content ${isProcessing ? 'cart-blur' : ''}`}>
          {checkoutMsg && (
            <div className="cart-message" style={{
              padding: '12px',
              marginBottom: '15px',
              background: checkoutMsg.includes('éxito') ? '#1a1a1a' : '#1a1a1a',
              border: '2px solid #ffffff',
              borderRadius: '8px',
              color: '#ffffff',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {checkoutMsg}
            </div>
          )}
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
                  <button onClick={canBePressed ? handleCheckout : null} className="btn-checkout">Finalizar Compra</button>
                </div>
              </div>
            </>
          )}
        </div>
        {isProcessing && (
          <div className="cart-processing-overlay">
            <h2>Su orden está siendo procesada</h2>
            <button onClick={handleCancelOrder}>
              Cancelar Orden
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart
