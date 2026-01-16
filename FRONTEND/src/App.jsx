import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { ProductDataContext } from './context/ProductContext.jsx'
import BottomNavbar from './components/BottomNavbar.jsx'
import "@flaticon/flaticon-uicons/css/all/all.css";
import { CustomerDataContext } from './context/CustomerContext.jsx'
import AdminNavbar from './Admin/AdminNavbar.jsx'
import AllRoutes from './routes/AllRoutes.jsx'

const App = () => {
  const { pathname } = useLocation()
  const { getprofile, profile } = useContext(CustomerDataContext)
  const { setlengthc, lengthc } = useContext(ProductDataContext)
  const [AllowNav, setAllowNav] = useState(false)
  const adminRoutesNav = ["/products", "/analytics", "/dashboard", "/orders", "/customers", "/messages","/archive","/coupon"]
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
      <AllRoutes setAllowNav={setAllowNav} />
    </div>
  )
}

export default App
