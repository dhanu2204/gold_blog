import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Catalog from './components/Catalog.jsx'
import ProductDetails from './components/ProductDetails.jsx'
import CartPage from './components/CartPage.jsx'
import Navbar from './components/Navbar.jsx'
import WishListPage from './components/WishListPage.jsx'
import OrdersPage from './components/OrdersPage.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import AddItem from './components/AddItem.jsx'
import AllProducts from './components/AllProducts.jsx'
import UpdateProduct from './components/UpdateProduct.jsx'
import AdminRoute from './components/AdminRoute.jsx';

const App = () => {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoutes>
          <Home/>
        </ProtectedRoutes>}/>
        <Route path="/category/:categoryName" element={
          <ProtectedRoutes>
          <Catalog/>
          </ProtectedRoutes>}/>
        <Route path="/products/:id" element={
          <ProtectedRoutes>
            <ProductDetails/>
          </ProtectedRoutes>
        }/>
        <Route path='/cart' element={
          <ProtectedRoutes>
            <CartPage/>
          </ProtectedRoutes>
        }/>
                <Route path="/wishlist" element={
          <ProtectedRoutes>
            <WishListPage />
          </ProtectedRoutes>
        }/>
        <Route path="/orders" element={
          <ProtectedRoutes>
            <OrdersPage/>
          </ProtectedRoutes>
        }/>
                <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel/>
          </AdminRoute>
        }/>
        <Route path="/additem" element={
          <AdminRoute>
            <AddItem/>
          </AdminRoute>
        }/>
        <Route path="/getall" element={
          <AdminRoute>
            <AllProducts/>
          </AdminRoute>
        }/>
        <Route path="/update/" element={
          <AdminRoute>
            <UpdateProduct/>
          </AdminRoute>
        }/>

      </Routes>
    </BrowserRouter>
  )
}

export default App