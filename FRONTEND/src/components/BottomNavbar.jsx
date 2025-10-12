import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@flaticon/flaticon-uicons/css/all/all.css";
import { CustomerDataContext } from "../context/CustomerContext";

const BottomNavbar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation()
    const [active, setActive] = useState("home");
    const [hidden, setHidden] = useState(false);
    const { profile } = useContext(CustomerDataContext)  // use this now

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                // Scroll down → hide
                setHidden(true);
            } else {
                // Scroll up → show
                setHidden(false);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { id: "home", regular: "fi fi-br-house-crack", solid: "fi fi-sr-house-crack" },
        { id: "orders", regular: "fi fi-br-shopping-bag", solid: "fi fi-sr-shopping-bag" },
        { id: "wishlist", regular: "fi fi-br-heart", solid: "fi fi-sr-heart" },
        { id: "cart", regular: "fi fi-br-shopping-cart", solid: "fi fi-sr-shopping-cart" },
        { id: "account", regular: "fi fi-br-circle-user", solid: "fi fi-sr-circle-user" },
    ];

    useEffect(() => {
        const checkpathname = (name) => {
            if (pathname.endsWith(name)) {
                setActive(name)
            }
        }
        navItems.find(e => checkpathname(e.id))
    }, [])

    return (
        <div
            className={`bg-gray-800 md:hidden z-50 py-2.5 text-2xl rounded-full w-[95vw] left-3  flex justify-between px-3 items-center fixed bottom-3 transition-transform duration-1000 ${hidden ? "translate-y-24 opacity-75" : "translate-y-0 opacity-100"}`}>
            {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                    <div key={item.id} onClick={() => {
                        setActive(item.id);
                        if (item.id === "home") {
                            navigate("/");
                        } else {
                            navigate(`/${item.id}`);
                        }
                    }}
                        className={`flex items-center justify-center h-12 w-12 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${isActive
                            ? "bg-white text-amber-900 scale-110 shadow-lg"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        <i className={`${isActive ? item.solid : item.regular} mt-2 text-2xl`}></i>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNavbar;
