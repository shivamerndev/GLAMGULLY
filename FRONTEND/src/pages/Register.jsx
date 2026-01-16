import { useContext, useState } from 'react'
import { toast, ToastContainer } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { CustomerDataContext } from '../context/CustomerContext'
import { Eye, EyeOff, Gem, Sparkles } from 'lucide-react'

const Register = () => {
    const { register } = useContext(CustomerDataContext)
    const navigate = useNavigate()
    const obj = { fullname: "", email: "", password: "", phone: "", gender: "male" }
    const [form, setForm] = useState(obj)
    const [confirm, setConfirm] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        if (isSubmitting) return
        if (form.password !== confirm) {
            toast.warn("Passwords don't match!")
            return
        }
        if (form.phone.length !== 10) {
            toast.warn("Phone must be 10 digits.")
            return
        }

        try {
            setIsSubmitting(true)
            const res = await register(form)
            if (res.message) {
                console.log(res.message)
                toast.success("Registered Successfully 😍")
                navigate("/account", { replace: true })
            }
        } catch (err) {
            if (err?.response?.data?.message) {
                toast.error(err.response.data.message)
            } else {
                console.error(err)
                toast.error("Registration failed")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 flex justify-center">
            <ToastContainer />
            <div className="max-w-md w-full bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-4 border border-amber-100">
                {/* Header */}
                <div className="text-center mb-2">
                    <div className="flex items-center justify-center mb-1.5">
                        <Gem className="h-6 w-6 text-amber-600 mr-2" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                            GLAMGULLY
                        </h1>
                        <Sparkles className="h-6 w-6 text-rose-500 ml-2" />
                    </div>
                    <p className="text-gray-600 text-sm">Create your account to explore glamgully.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-2 bg-gradient-to-r from-amber-800/80 to-orange-800/80 bg-clip-text text-transparent">
                    <div>
                        <label className="block  mb-1.5 font-semibold" htmlFor="fullname">Full Name</label>
                        <input
                            minLength={4}
                            required
                            type="text"
                            id="fullname"
                            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                            value={form.fullname}
                            className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 font-medium" htmlFor="phone">Phone</label>
                        <input
                            required
                            type="number"
                            id="phone"
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            value={form.phone}
                            className={` ${form.phone.length > 10 ? "focus:ring-red-500" : "focus:ring-amber-400"} w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-200 bg-white/70`}
                            placeholder="Enter your phone number"
                        />
                        <p className={`${form.phone.length > 10 ? "block" : "hidden"}  text-red-500 text-xs pt-2`}>phone must be 10 digits.</p>
                    </div>

                    <div>
                        <label className="block mb-1.5 font-medium" htmlFor="email">Email</label>
                        <input
                            required
                            type="email"
                            id="email"
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            value={form.email}
                            className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                required
                                minLength={8}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                value={form.password}
                                className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-1.5 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70"
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1.5 font-medium">Confirm Password</label>
                        <div className="relative">
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={(e) => setConfirm(e.target.value)}
                                value={confirm}
                                className={`w-full border rounded-lg px-4 py-1.5 pr-12 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/70 ${confirm && form.password !== confirm
                                    ? 'border-red-300 focus:ring-red-400 text-amber-950'
                                    : 'border-amber-300 text-amber-950  focus:ring-amber-400'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {confirm && form.password !== confirm && (
                            <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1.5 font-medium" htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            onChange={(e) => { setForm({ ...form, gender: e.target.value }) }}
                            value={form.gender}
                            className="w-full border border-amber-300 text-amber-950  rounded-lg px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white/70">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <button type="submit"
                        disabled={isSubmitting}
                        className={`w-full cursor-pointer bg-gradient-to-r from-amber-500 to-rose-500 text-white py-1.5 mt-2 rounded-lg transition-all duration-200 font-semibold shadow-lg transform ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:from-amber-600 hover:to-rose-600 hover:shadow-xl hover:-translate-y-0.5'}`}>
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-3 text-sm text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/user/login" className="text-amber-600 hover:text-rose-600 hover:underline font-semibold transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div >
    )
}

export default Register;