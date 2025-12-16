import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";

function DrinkCard({ title, image, price, description, stock, onAddToCart }) {
  const isOutOfStock = stock === 0;
  const [isProcessing, setIsProcessing] = useState(false);
  const {user} = useAuth();
  useEffect(() => {
    if (user)
      setIsProcessing(Boolean(user.ProcesandoOrden));
  }, [user]);

  return (
    <article className="card">
      <img className="card-image" src={image} alt={title} />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-info">
          <p className="card-price">{price}</p>
          <p className={`card-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
            Stock: {stock}
          </p>
        </div>
        <button
          className={`btn ${isOutOfStock || isProcessing ? 'btn-disabled' : ''}`}
          onClick={() => !isOutOfStock && !isProcessing && onAddToCart && onAddToCart()}
          disabled={isOutOfStock || isProcessing}
        >
          {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
        </button>
      </div>
    </article>
  )
}

export default DrinkCard