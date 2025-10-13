import './App.css'
import Home from './components/home/Home'
import Products from './components/products/Product'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import About from './components/About'
import Contact from './components/Contact'
import { Toaster } from 'react-hot-toast'
import React, { useEffect } from 'react'
import Cart from './components/cart/Cart'
import Login from './components/auth/Login'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/auth/Register'
import Profile from './profile/profile'
import Dashboard from './admin/Dashboard'
import OrderManagement from './admin/OrderManagement'
import ProductManagement from './admin/ProductManagement'
import AddProduct from './admin/AddProduct'
import { fetchCart } from './store/action'
import Checkout from './components/checkout/Checkout'
import { useDispatch } from 'react-redux'
import { setLocations } from "./store/reducers/LocationReducer";
import api from './api/api'


function AppContent() {
  const location = useLocation();
  
  useEffect(() => {
    fetchCart();
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
      const fetchLocation = async () => {
          const {data} = await api.get("/public/location");
          dispatch(setLocations(data));
      }
      fetchLocation()
  }, [dispatch])

  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='profile' element={<Profile />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin/orders" element={<OrderManagement />} />
          <Route path="admin/products" element={<ProductManagement />} />
          <Route path="admin/products/add" element={<AddProduct />} />
        </Route>
      </Routes>
      <Toaster position='top-center' />
    </>
  )
}

// Component chính
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App