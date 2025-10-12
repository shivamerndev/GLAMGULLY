import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { AdminDataContext } from '../context/AdminContext'
import { Eye, EyeOff, Gem, Sparkles } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { LoginAdmin, GetAdminDashboard } = useContext(AdminDataContext)
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    GetAdminDashboard().then(res => {
      if (res) return navigate("/admin/glamgully/dashboard")
    }).catch(err => console.log(err))
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    LoginAdmin(form).then(res => {
      toast.success(res.message)
      setTimeout(() => {
        navigate("/admin/glamgully/dashboard")
      }, 3000)
    })
      .catch(err => toast.error("Wrong username or password"))
  }

  return (
    <div className="max-w-md bg-gradient-to-br flex flex-col justify-center from-amber-50 via-white to-rose-50 h-screen mx-auto py-8  shadow-lg rounded-lg px-8">
      <ToastContainer />
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Gem className="h-6 w-6 text-amber-600 mr-2" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
            GLAMGULLY
          </h1>
          <Sparkles className="h-6 w-6 text-rose-500 ml-2" />
        </div>
        <p className="text-gray-600 text-sm">Login Your Account For Access Admin Panel.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4 bg-gradient-to-r from-amber-800/80 to-orange-800/80 bg-clip-text text-transparent">
        <div>
          <label className="block mb-2 font-medium" htmlFor="username">Username & Email</label>
          <div className="relative">
            <input
              required
              minLength={5}
              id="username"
              onChange={(e) => setForm({ ...form, username: e.target.value })} value={form.username}
              className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70"
              placeholder="Enter username or email." />
          </div>

        </div>
        <div>
          <label className="block mb-2 font-medium" htmlFor="password">Password</label>
          <div className="relative">
            <input
              required
              minLength={8}
              type={showPassword ? "text" : "password"}
              id="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })} value={form.password}
              className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

        </div>

        <button type="submit" className="w-full cursor-pointer bg-gradient-to-r from-amber-500 to-rose-500 text-white py-2 mt-2 rounded-lg hover:from-amber-600 hover:to-rose-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Login As Admin
        </button>
      </form>
      <div className="mt-3 text-sm text-center">
        <span className="text-gray-600">Create new account? </span>
        <Link to="/admin/register" className="text-amber-600 hover:text-rose-600 hover:underline font-semibold transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default Login;
