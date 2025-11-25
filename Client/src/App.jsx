import BarPlayeroLayout from "./Components/BarPlayeroLayout"
import BarPlayeroFooter from "./Components/BarPlayeroFooter"
import { CartProvider } from "./Context/CartContext"

function App() {
  return (
    <CartProvider>
      <BarPlayeroLayout />
      <BarPlayeroFooter />
    </CartProvider>
  )
}

export default App
