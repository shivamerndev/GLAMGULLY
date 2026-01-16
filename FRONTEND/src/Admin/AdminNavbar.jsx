import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Users, MessageSquare, BarChart3, MenuIcon, Archive } from 'lucide-react';
import { IoClose } from 'react-icons/io5';
import { MdDiscount } from 'react-icons/md';

const AdminNavbar = () => {
    const navigate = useNavigate()
    const [activeNavItem, setActiveNavItem] = useState('dashboard');
    const [showsm, setShowsm] = useState(false)

    const sidebarItems = [
        { icon: Package, label: 'dashboard' },
        { icon: Package, label: 'orders' },
        { icon: Users, label: 'customers' },
        { icon: Package, label: 'products' },
        { icon: MessageSquare, label: 'messages' },
        { icon: BarChart3, label: 'analytics' },
        { icon: MdDiscount, label: 'coupon' },
        { icon: Archive, label: 'archive' }
    ];

    useEffect(() => {
        setActiveNavItem(location.pathname.split("/glamgully/")[1])
    }, [location.search])


    return <aside className="md:w-64 w-full  md:h-full fixed z-50 top-0 md:block flex flex-col justify-center items-end left-0  md:shadow-lg border-r border-gray-200">
        {/* Logo */}
        <div className="text-amber-900  p-4 w-full  md:bg-amber-50/50 bg-orange-200/50 backdrop-blur-2xl flex items-center justify-between border-b  border-gray-100">
            <div className="flex items-center gap-3 ">
                <div className="w-10 h-10 bg-amber-50 rounded-full">
                    <img className='object-cover h-full w-full' src="/src/assets/logo-removebg-preview.png" alt="" />
                </div>
                <span className="text-xl font-bold ">GlamGully</span>
            </div>
            {showsm ? <IoClose onClick={() => setShowsm(false)} className='md:hidden w-6 h-6' /> : <MenuIcon onClick={() => setShowsm(true)} className='md:hidden' />}
        </div>
        {/* Navigation */}
        <nav className={`p-3 ${showsm ? "block w-2/3 bg-amber-50" : " hidden "} md:block`}>
            <div className='space-y-1'>

                {/* Then modify the sidebarItems mapping section like this: */}
                {sidebarItems.map((item, index) => (
                    <button
                        onClick={() => { setActiveNavItem(item.label); navigate(`/admin/glamgully/${item.label}`); setShowsm(false) }}
                        key={index}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all ${item.label === activeNavItem
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium capitalize">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    </aside>
}

export default AdminNavbar
