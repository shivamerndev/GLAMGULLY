import { useState, useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductDataContext } from '../context/ProductContext';
import { IoIosSearch } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import SearchInput from "../components/SearchInput";
import LocationChooser from "../utils/LocationChooser";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { VscAccount } from "react-icons/vsc";
import { IoHomeOutline } from "react-icons/io5";
import { IoBagHandleOutline } from "react-icons/io5";
import { Heart } from 'lucide-react';
import { CustomerDataContext } from '../context/CustomerContext';

const Navbar = () => {
    const { lengthc } = useContext(ProductDataContext)
    const { pathname } = useLocation()
    const [search, setsearch] = useState(false);
    const navigate = useNavigate()
    const { profile } = useContext(CustomerDataContext)

    const handleLinks = (t) => {
        if (t === "search") {
            setsearch(true)
        }
        else if (t === "home") {
            navigate(`/`)
        } else {
            navigate(`/${t}`)
        }
    }

    return (
        <div className="md:flex sticky md:h-16 items-center md:top-0 xs:-top-16 z-10 backdrop-blur-xl md:backdrop-blur-2xl bg-white/10 select-none justify-between w-full px-4">
            {/* Mobile only (hidden on md+) */}
            {pathname === "/" && (
                <div className="block md:hidden w-full">
                    <LocationChooser />
                    <SearchInput />
                </div>
            )}
            {/* Desktop & Tablet (md+) always visible */}
            <div className="hidden md:w-1/3  md:flex justify-start items-center text-amber-950">
                <LocationChooser />
                {!search && <div onClick={() => handleLinks("search")} className="flex mt-2  flex-col relative items-center cursor-pointer ">
                    <IoIosSearch size={20} />
                    <h1 className='hidden md:block text-sm leading-3'>search</h1>
                </div>}

            </div>
            <div className="hidden md:flex justify-center w-1/3">
                {search ? <div className="w-full ">
                    <SearchInput search={search} setsearch={setsearch} />
                </div> : <a href="/">
                    <img className=" mt-4 h-10 ml-6  " src="/glam_text-removebg-preview.png" alt="logo" />
                </a>
                }
            </div>
            <div className=" hidden md:flex justify-between pl-4 items-center text-xs  w-1/3 text-amber-950">
                {[{ t: "home", icon: <IoHomeOutline size={20} /> }, { t: "about", icon: <HiOutlineOfficeBuilding size={20} /> }, { t: "wishlist", icon: <Heart size={20} /> }, { t: "orders", icon: <IoBagHandleOutline size={20} /> }, { t: "cart", icon: <LuShoppingCart size={20} /> }, { t: "account", icon: <VscAccount size={20} /> },
                ].map(e => <div onClick={() => handleLinks(e.t)} key={e.t} className="flex flex-col relative items-center cursor-pointer ">
                    {e.t === "account" && profile ? <div className='bg-red-500 w-7 h-7 mb-0.5 rounded-full overflow-hidden'><img className='w-full h-full object-cover ' src={profile?.gender === "male" ? "/male.jpg" : "/female.jpg"} alt="avatar" /></div> : e.icon}
                    {e.t === "cart" && (lengthc > 0 || profile?.cart?.length > 0) && <h1 className='bg-amber-950 text-amber-50 -top-1.5 -right-2 text-xs px-1 rounded-full absolute '>{lengthc || profile?.cart.length}</h1>}
                    <h1 className='md:hidden capitalize lg:block'>{e.t === 'account' && profile ? profile?.fullname?.split(" ")[0] : e.t}</h1>
                </div>)}
            </div>
        </div>
    )
}

export default Navbar
