import React, { useContext, useState } from 'react'
import { AdminDataContext } from '../context/AdminContext'
import { toast, ToastContainer } from "react-toastify"
import { Link } from "react-router-dom"
import { Gem, Sparkles } from 'lucide-react'

const Register = () => {
    const { createAdmin } = useContext(AdminDataContext)
    const obj = { profilepic: undefined, username: "", fullname: "", email: "", password: "", phone: "", gender: "male" }
    const [form, setForm] = useState(obj)

    const handleRegister = (e) => {
        e.preventDefault()
        createAdmin(form).then(res => { toast.success(res) }).catch(err => toast.error(err?.response.data))
    }

    return (
        <div className="max-w-md bg-white min-h-screen mx-auto pt-4 pb-2  shadow-lg rounded-lg px-8">
            <ToastContainer />
            <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-1">
                    <Gem className="h-6 w-6 text-amber-600 mr-2" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                        GLAMGULLY
                    </h1>
                    <Sparkles className="h-6 w-6 text-rose-500 ml-2" />
                </div>
                <p className="text-gray-600 text-sm">Create An Account For Access Admin Panel.</p>
            </div>
            <form onSubmit={handleRegister} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="relative hidden">
                    <label htmlFor="profilepic"
                        className="group block  border-2 border-dashed border-amber-300 hover:border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:shadow-lg">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent font-semibold">
                            Upload Picture
                        </span>
                        <span className="block text-sm text-amber-600 mt-1">(Not Working Right Now.)</span>
                    </label>
                    <input type="file" id="profilepic" className="hidden" accept="image/*" />
                </div>

                {/* Full Name */}
                <div>
                    <label className=" text-amber-900 font-semibold mb-2 flex items-center gap-2" htmlFor="fullname">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name
                    </label>
                    <input
                        required
                        type="text"
                        id="fullname"
                        onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                        value={form.fullname}
                        placeholder="Enter your full name"
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all hover:border-amber-300"
                    />
                </div>

                {/* Username */}
                <div>
                    <label className=" text-amber-900 font-semibold mb-2 flex items-center gap-2" htmlFor="username">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Username
                    </label>
                    <input
                        required
                        type="text"
                        id="username"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        value={form.username}
                        placeholder="Choose a username"
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all hover:border-amber-300"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className=" text-amber-900 font-semibold mb-2 flex items-center gap-2" htmlFor="email">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                    </label>
                    <input
                        required
                        type="email"
                        id="email"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        value={form.email}
                        placeholder="your@email.com"
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all hover:border-amber-300"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className=" text-amber-900 font-semibold mb-2 flex items-center gap-2" htmlFor="password">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Password
                    </label>
                    <input
                        required
                        type="password"
                        id="password"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        value={form.password}
                        placeholder="Create a strong password"
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all hover:border-amber-300"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className=" text-amber-900 font-semibold mb-2 flex items-center gap-2" htmlFor="phone">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone
                    </label>
                    <input
                        required
                        type="number"
                        id="phone"
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        value={form.phone}
                        placeholder="Enter phone number"
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all hover:border-amber-300"
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className=" text-amber-900 font-semibold mb-2 flex items-center gap-2" htmlFor="gender">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Gender
                    </label>
                    <select
                        id="gender"
                        onChange={(e) => { setForm({ ...form, gender: e.target.value }) }}
                        value={form.gender}
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all hover:border-amber-300 bg-white"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 rounded-2xl transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Admin Account
                </button>
            </form>
            <div className="mt-2 text-center">
                <span className="text-amber-950">Already have an account? </span>
                <Link to="/admin/login" className="text-amber-600 hover:underline font-semibold">
                    Login
                </Link>
            </div>
        </div>
    )
}

export default Register
