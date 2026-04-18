import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProfilePage from './pages/ProfilePage'
import AllProductsPage from './pages/AllProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer position="bottom-right" theme="dark" />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="category/:categoryId" element={<ProductsPage />} />
        <Route path="products" element={<AllProductsPage />} />
        <Route path="product/:productId" element={<ProductDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="order/:id" element={<OrderDetailsPage />} />
        {/* Catch-all for debugging */}
        <Route path="*" element={<div>404 - Page Not Found at {window.location.pathname}</div>} />
      </Routes>
    </div>
  )
}

export default App
