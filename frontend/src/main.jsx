import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {CartProvider} from './components/CartContext.jsx'
import { WishListProvider } from './components/WishListContext.jsx'
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <WishListProvider>
    <App />
     <Toaster position="bottom-right" />
      </WishListProvider>
    </CartProvider>
  </StrictMode>,
)
