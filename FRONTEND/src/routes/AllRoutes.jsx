import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import Account from '../pages/Account.jsx'
import Contact from '../pages/About.jsx'
import ProductDetails from '../pages/ProductDetails.jsx'
import Register from '../pages/Register.jsx'
import Login from '../pages/Login.jsx'
import CheckoutForm from '../pages/CheckoutForm.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Cart from '../components/Cart.jsx'
import AllProductsPage from '../pages/AllProductsPage.jsx'
import Wishlist from '../pages/Wishlist.jsx'
import MyOrders from '../pages/MyOrders.jsx'
import CustomerProtected from '../components/templates/CustomerProtected.jsx'
import AccountSettings from '../pages/Customs/AccountSettings.jsx'
import TrackOrder from '../pages/TrackOrder.jsx'
import AdminProtected from '../Admin/AdminProtected.jsx'
import AdminDashboard from '../Admin/AdminDashboard.jsx'
import AddOrEdit from '../Admin/AddOrEditProduct.jsx'
import OrdersPage from '../Admin/OrdersPage.jsx'
import AdminRegister from '../Admin/AdminRegister.jsx'
import OrderDetails from '../Admin/OrderDetails.jsx'
import ProductsPage from '../Admin/ProductsPage.jsx'
import CustomersPage from '../Admin/CustomersPage.jsx'
import Messages from '../Admin/Messages.jsx'
import Analytics from '../Admin/Analytics.jsx'
import AdminSettings from '../Admin/AdminSettings.jsx'
import AdminLogin from '../Admin/AdminLogin.jsx'
import ArchiveCategory from '../Admin/ArchiveCategory.jsx'
import CouponPage from '../Admin/CouponPage.jsx'
import PersonalUse from '../pages/Customs/PersonalUse.jsx'

const AllRoutes = ({ setAllowNav }) => {
    return (
        <Routes>
            <Route path='/admin/register' element={<AdminRegister />} />
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path="/admin/glamgully/dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
            <Route path="/admin/glamgully/product/:productId" element={<AdminProtected><AddOrEdit /></AdminProtected>} />
            <Route path="/admin/glamgully/orders" element={<AdminProtected><OrdersPage /></AdminProtected>} />
            <Route path="/admin/glamgully/orders/:orderId" element={<AdminProtected><OrderDetails /></AdminProtected>} />
            <Route path="/admin/glamgully/products" element={<AdminProtected><ProductsPage /></AdminProtected>} />
            <Route path="/admin/glamgully/customers" element={<AdminProtected><CustomersPage /></AdminProtected>} />
            <Route path="/admin/glamgully/messages" element={<AdminProtected><Messages /></AdminProtected>} />
            <Route path="/admin/glamgully/analytics" element={<AdminProtected><Analytics /></AdminProtected>} />
            <Route path="/admin/glamgully/settings" element={<AdminProtected><AdminSettings /></AdminProtected>} />
            <Route path="/admin/glamgully/archive" element={<AdminProtected><ArchiveCategory /></AdminProtected>} />
            <Route path="/admin/glamgully/coupon" element={<AdminProtected><CouponPage /></AdminProtected>} />
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
            <Route path='/use/have' element={<PersonalUse/>} />
            <Route path='*' element={<div className='flex items-center justify-center h-screen text-3xl font-semibold'>404 | Page Not Found</div>} />
        </Routes>
    )
}

export default AllRoutes;