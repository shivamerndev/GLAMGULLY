import { useContext, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Account from './pages/Account.jsx'
import Contact from './pages/About.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Navbar from './components/Navbar.jsx'
import AdminPanel from './Admin/AdminPanel.jsx'
import AdminProtected from './Admin/AdminProtected.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import AdminLogin from './Admin/AdminLogin.jsx'
import CheckoutForm from './pages/CheckoutForm.jsx'
import OrderSummary from './components/OrderSummary.jsx'
import Cart from './components/Cart.jsx'
import { ProductDataContext } from './context/ProductContext.jsx'
import ProductsPage from './Admin/ProductsPage.jsx'
import CustomersPage from './Admin/CustomersPage.jsx'
import OrdersPage from './Admin/OrdersPage.jsx'
import BottomNavbar from './components/BottomNavbar.jsx'
import "@flaticon/flaticon-uicons/css/all/all.css";
import MyOrders from './pages/MyOrders.jsx'
import AllProductsPage from './pages/AllProductsPage.jsx'
import { CustomerDataContext } from './context/CustomerContext.jsx'
import Wishlist from './pages/Wishlist.jsx'
import CustomerProtected from './components/templates/CustomerProtected.jsx'
import AccountSettings from './pages/Customs/AccountSettings.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import AdminDashboard from './Admin/AdminDashboard.jsx'
import AddOrEdit from './Admin/AddOrEditProduct.jsx'
import AdminNavbar from './Admin/AdminNavbar.jsx'
import OrderDetails from './Admin/OrderDetails.jsx'
import Messages from './Admin/Messages.jsx'
import AdminRegister from "./Admin/AdminRegister.jsx"
import Analytics from './Admin/Analytics.jsx'

const App = () => {
  const { pathname } = useLocation()
  const { getprofile, profile } = useContext(CustomerDataContext)
  const { setlengthc, lengthc } = useContext(ProductDataContext)
  const [AllowNav, setAllowNav] = useState(false)
  const adminRoutesNav = ["/products", "/analytics", "/dashboard", "/orders", "/customers", "/messages"]
  const adminNav = adminRoutesNav.includes(pathname.split("/glamgully")[1])

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      return;
    }
    getprofile().catch(err => {
      console.log(err.response.data.message);
      const cartlength = JSON.parse(localStorage.getItem("cart"))
      if (cartlength) {
        setlengthc(cartlength?.length)
      } else {
        setlengthc(0)
      }
    })
    
  }, [])

  useEffect(() => {
    if (lengthc <= 0 && profile) {
      getprofile().catch(err => {
        console.log(err.response.data.message) // don't use setlengthc beacuse infity
      })
    }
  }, [lengthc])

  const allowedRoutesForTopNav = ["/cart", "/about", "/wishlist", "/orders", "/account", "/product", "/category", "/checkout"]
  const allowedRoutesForBottomNav = ["/wishlist", "/about", "/orders", "/account"]

  return (
    <div className={`bg-white text-black  font-[Poppins,Tangerine,sans-serif] ${adminNav && "md:pl-64 md:pt-0 pt-16"} overflow-hidden md:min-h-screen w-full`}>

      {adminNav && <AdminNavbar />}
      {(allowedRoutesForTopNav.includes(pathname) || AllowNav) && <Navbar />}
      {(allowedRoutesForBottomNav.includes(pathname) || AllowNav) && <BottomNavbar />}

      <Routes>
        <Route path='/admin/register' element={<AdminRegister />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path="/admin/glamgully" element={<AdminProtected><AdminPanel /></AdminProtected>} />
        <Route path="/admin/glamgully/dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
        <Route path="/admin/glamgully/product/:productId" element={<AdminProtected><AddOrEdit /></AdminProtected>} />
        <Route path="/admin/glamgully/orders" element={<AdminProtected><OrdersPage /></AdminProtected>} />
        <Route path="/admin/glamgully/orders/:orderId" element={<AdminProtected><OrderDetails /></AdminProtected>} />
        <Route path="/admin/glamgully/products" element={<AdminProtected><ProductsPage /></AdminProtected>} />
        <Route path="/admin/glamgully/customers" element={<AdminProtected><CustomersPage /></AdminProtected>} />
        <Route path="/admin/glamgully/messages" element={<AdminProtected><Messages /></AdminProtected>} />
        <Route path="/admin/glamgully/analytics" element={<AdminProtected><Analytics /></AdminProtected>} />
        <Route path="/" element={<Home setAllowNav={setAllowNav} />} />
        <Route path='/account' element={<CustomerProtected><Account /></CustomerProtected>} />
        <Route path='/about' element={<Contact />} />
        <Route path='/product/:productId' element={<ProductDetails />} />
        <Route path='/checkout/cart' element={<CustomerProtected><CheckoutForm /></CustomerProtected>} />
        <Route path='/checkout/:productId' element={<CustomerProtected><CheckoutForm /></CustomerProtected>} />
        <Route path='/checkout/order/:productId' element={<CustomerProtected><OrderSummary /></CustomerProtected>} />
        <Route path='/checkout/order/cart' element={<CustomerProtected><OrderSummary /></CustomerProtected>} />
        <Route path='/product/all' element={<AllProductsPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<CustomerProtected><Wishlist /></CustomerProtected>} />
        <Route path='/orders' element={<CustomerProtected><MyOrders /></CustomerProtected>} />
        <Route path='/track/orders/:orderId' element={<CustomerProtected><TrackOrder /></CustomerProtected>} />
        <Route path='/user/register' element={<Register />} />
        <Route path='/user/login' element={<CustomerProtected><Login /></CustomerProtected>} />
        <Route path='/user/settings' element={<CustomerProtected><AccountSettings /></CustomerProtected>} />
      </Routes>
    </div>
  )
}

export default App
