import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomerDataContext } from '../context/CustomerContext'
import {  Mail, Phone, Calendar, Heart, ShoppingBag, MapPin, Settings, Crown } from 'lucide-react'
import ProgressLoader from '../utils/ProgressLoader'
import { toast, ToastContainer } from 'react-toastify'

const Account = () => {
  const { logout, profile } = useContext(CustomerDataContext)
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (profile ?
    <div className=" bg-gradient-to-br border-t-2 border-amber-100/50  from-amber-50 via-white to-rose-50">
      <div className="w-full">
        <ToastContainer />
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl">
          <div className="pt-8 px-4 pb-4">
            {/* User Avatar & Basic Info */}
            <div className="flex w-full md:px-10  flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="relative">
                <div className="overflow-hidden w-24 h-24 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                  <Crown className="h-8 w-8 text-amber-500 absolute -top-1 -left-2 rotate-330" />
                  <img src={profile?.gender === "male" ? "/male.jpg" : profile?.gender === "female" ? "/female.jpg" : "/default.png"} alt="avatar" />
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile?.fullname}</h2>
                <p className="text-gray-600 ">gender : {profile?.gender}</p>
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {formatDate(profile?.createdAt)}
                </div>
              </div>
              <button onClick={() => {
                logout().then(res => {
                  toast.success(res)
                  navigate('/user/login', { replace: true });
                })
              }} className='bg-gradient-to-tr self-center md:ml-auto cursor-pointer from-amber-500 to-red-500 px-4 py-0.5 rounded-full font-semibold text-amber-50 '>Logout</button>
            </div>

            {/* Contact Information */}
            <div className="grid  md:px-16 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-amber-50 to-transparent p-4 rounded-xl border border-amber-100">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="font-medium text-gray-700">Email Address</span>
                </div>
                <p className="text-gray-800 font-medium">{profile?.email}</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-transparent p-4 rounded-xl border border-rose-100">
                <div className="flex items-center mb-2">
                  <Phone className="h-5 w-5 text-rose-600 mr-2" />
                  <span className="font-medium text-gray-700">Phone Number</span>
                </div>
                <p className="text-gray-800 font-medium">{profile?.phone}</p>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid  md:px-7 grid-cols-2 md:grid-cols-4 gap-4 ">
              <div className="bg-white/60 p-4 rounded-xl text-center cursor-pointer shadow-xl border border-gray-100">
                <Heart className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{profile?.wishlist?.length || 0}</div>
                <div className="text-sm text-gray-600">Wishlist Items</div>
              </div>
              <div className="bg-white/60 p-4 rounded-xl text-center border border-gray-100 cursor-pointer shadow-xl">
                <ShoppingBag className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{profile?.cart?.length || 0}</div>
                <div className="text-sm text-gray-600">Cart Items</div>
              </div>
              <div className="bg-white/60 p-4 rounded-xl text-center border border-gray-100 cursor-pointer shadow-xl">
                <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm font-bold">📦</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{profile?.ordersHistory?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white/60 p-4 rounded-xl text-center border border-gray-100 cursor-pointer shadow-xl">
                <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{profile?.address?.length || 0}</div>
                <div className="text-sm text-gray-600">Saved Address</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 px-6 my-4">

          <button onClick={() => navigate('/user/settings')} className="bg-white/80 cursor-pointer backdrop-blur-sm p-4 rounded-xl border border-amber-100 shadow-2xl transition-all duration-200 group">
            <Settings className="h-8 w-8 text-amber-600 mx-auto mb-3 group-hover:rotate-90 transition-transform duration-300" />
            <h3 className="font-semibold text-gray-800 mb-1">Account Settings</h3>
            <p className="text-sm text-gray-600">Update your profile information</p>
          </button>
          <button onClick={() => navigate('/wishlist')} className="bg-white/80 cursor-pointer backdrop-blur-sm p-4 rounded-xl border border-rose-100 shadow-2xl transition-all duration-200 group">
            <Heart className="h-8 w-8 text-rose-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-gray-800 mb-1">My Wishlist</h3>
            <p className="text-sm text-gray-600">View your favorite jewelry</p>
          </button>
          <button onClick={() => navigate('/orders')} className="bg-white/80 cursor-pointer backdrop-blur-sm p-4 rounded-xl border border-purple-100 shadow-2xl transition-all duration-200 group">
            <ShoppingBag className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-semibold text-gray-800 mb-1">Order History</h3>
            <p className="text-sm text-gray-600">Track your past purchases</p>
          </button>
        </div>

      </div>
    </div> : <ProgressLoader />
  )
}

export default Account;