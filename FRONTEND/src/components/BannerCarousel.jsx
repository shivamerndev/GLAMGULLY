import { useEffect, useState, useRef } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BannerCarousel = () => {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const navigate = useNavigate();

    const banners = [
        {
            type: "custom",
            title: "Discover the New Collection",
            desc: "GlamGully – Where timeless elegance meets your unique style.",
            btn: "Shop Now",
            img: "https://imgs.search.brave.com/8FEQE_L3gEocO6ek7JozJXZx0U3VKR6iIvILiW2TMuY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Bo/b3RvLTE2NzQyNTU0/NjY4MzYtZjM4ZDFj/YzZmZDBkP2ZtPWpw/ZyZxPTYwJnc9MzAw/MCZpeGxpYj1yYi00/LjEuMCZpeGlkPU0z/d3hNakEzZkRCOE1I/eHpaV0Z5WTJoOE1U/ZDhmSGR2YldGdUpU/SXdhbVYzWld4eWVY/eGxibnd3Zkh3d2ZI/eDhNQT09"
        },
        {
            type: "custom",
            title: "Jewelry That Speaks Your Story",
            desc: "Every piece from GlamGully is designed to reflect beauty, confidence, and you.",
            btn: "Shop Now",
            img: "https://imgs.search.brave.com/M37SUBSq1y0hwhk2qFxiSxcGJg4ApNvQUSFKrpfd4TA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9iZWF1dGlmdWwt/d29tYW4td2Vhcmlu/Zy1sdXh1cnktamV3/ZWxsZXJ5LWJsYWNr/LWJhY2tncm91bmRf/ODY0NTk1LTY5MS5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw"
        },
        {
            type: "custom",
            title: "Elegance in Every Detail",
            desc: "From delicate classics to bold statements – GlamGully adds grace to every occasion.",
            btn: "Shop Now",
            img: "https://imgs.search.brave.com/H0XTjsNQwiouD2Uz63iAP__lWjEyiOEu690U_TuLguU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/OTQwNjIwNDU3NzYt/ZjQ4ZDliNmRlNTdl/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE0zeDhkMjl0/WVc0bE1qQnFaWGRs/Ykd4bGNubDhaVzU4/TUh4OE1IeDhmREE9"
        },
    ];


    // Auto slide every 3s
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 3000);
        return () => {
            clearInterval(interval)
        };
    }, [banners.length]);

    // Handle swipe manually
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        handleSwipe();
    };

    const handleSwipe = () => {
        const deltaX = touchStartX.current - touchEndX.current;
        if (deltaX > 50) {
            setCurrent((prev) => (prev + 1) % banners.length);
        } else if (deltaX < -50) {
            setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
        }
    };

    return (
        <div className="sm:overflow-hidden relative w-[95vw] md:mt-8  mx-auto h-[30vh] sm:h-[35vh] md:h-[70vh] lg:h-[80vh] "
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>

            <div className="flex h-[90%] w-full   transition-transform duration-700   ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}>
                {banners.map((banner, i) => <div key={i}
                    className="w-full shrink-0 h-full md:mt-4 rounded-md md:rounded-2xl  bg-[#f5f0eb] flex items-center justify-between">
                    <div className="flex-1  pl-4 md:pl-16">
                        <h2 className="sm:text-xl  text-sm font-bold md:text-3xl text-gray-800 mb-3 leading-tight">
                            {banner.title}
                        </h2>
                        <p className="text-gray-600 mb-1 sm:mb-4 sm:text-base  text-xs md:leading-normal leading-3">{banner.desc}</p>
                        <button onClick={() => navigate('/product/all')} className="bg-amber-950 cursor-pointer hover:bg-amber-800  md:mt-8 mt-2 text-white px-2 sm:text-base text-sm sm:py-1.5 py-0.5 sm:px-4 sm:rounded-lg rounded-md shadow-md transition">
                            {banner.btn}
                        </button>
                    </div>
                    <div className="flex-1  rounded-xl md:rounded-sm  overflow-hidden h-full flex justify-end">
                        <img src={banner.img} alt="New Collection" className=" object-cover object-center md:object-center w-full h-full" />
                    </div>
                </div>
                )}
            </div>

            <h1
                onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
                className="absolute hidden md:block right-2 text-4xl text-gray-800 font-semibold rounded-full bg-[#ffffff5c] top-2/5">
                <MdArrowRight />
            </h1>
            <h1 onClick={() => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="absolute hidden md:block left-2 text-4xl text-gray-700 font-semibold rounded-full  bg-[#8f8e8e7c] top-2/5">
                <MdArrowLeft />
            </h1>

            {/* Dots */}
            <div className="absolute sm:bottom-0 -bottom-2 bg-red-5 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i === current ? "bg-gray-400" : "bg-gray-200"}`} />)}
            </div>
        </div>
    );
};

export default BannerCarousel;
