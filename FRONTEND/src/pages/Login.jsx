import { useContext, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CustomerDataContext } from '../context/CustomerContext'
import { Eye, EyeOff, Gem, Sparkles } from 'lucide-react'


const Login = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { login, getprofile } = useContext(CustomerDataContext)
  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  
  const handleLogin = (e) => {
    e.preventDefault()
    login(form).then(res => {
      toast.success(res.message)
      getprofile()
      setTimeout(() => {
        if (state?.pathname === '/user/login') {
          return navigate("/account", { replace: true })
        }
        navigate(state ? state.pathname + state.search : "/account", { replace: true });
      }, 1000)
    }).catch(err => toast.error("Wrong email or password"))
  }

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex justify-center">
      <ToastContainer />
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl px-8 flex flex-col justify-center border border-amber-100">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <Gem className="h-6 w-6 text-amber-600 mr-2" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
              GLAMGULLY
            </h1>
            <Sparkles className="h-6 w-6 text-rose-500 ml-2" />
          </div>
          <p className="text-gray-600 text-sm">Login your account to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-gradient-to-r from-amber-800/80 to-orange-800/80 bg-clip-text text-transparent">

          <div>
            <label className="block mb-2 font-medium" htmlFor="email">Email</label>
            <input
              required
              type="email"
              id="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              value={form.email}
              className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium" htmlFor="password">Password</label>
            <div className="relative">
              <input
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                value={form.password}
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
            <p
              onClick={() => {
                const phone = "918591066134";
                const msg = encodeURIComponent("Hello, I forgot my password. Please help me reset it.");
                window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
              }}
              className="text-amber-500 text-xs cursor-pointer px-2 inline hover:text-rose-600 hover:underline transition-colors">
              Forget password ?
            </p>

          </div>


          <button type="submit" className="w-full cursor-pointer bg-gradient-to-r from-amber-500 to-rose-500 text-white py-2 mt-2 rounded-lg hover:from-amber-600 hover:to-rose-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Login
          </button>
        </form>

        <div className="mt-3 text-sm text-center">
          <span className="text-gray-600">Create new account? </span>
          <Link to="/user/register" className="text-amber-600 hover:text-rose-600 hover:underline font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
