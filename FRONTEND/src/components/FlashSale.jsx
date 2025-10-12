import { useContext, useEffect, useRef, useState } from "react";
import { Star, Clock, BoxIcon } from "lucide-react";
import NewCard from "./NewCard";
import { Link, replace, useLocation, useNavigate, useParams } from "react-router-dom";
import { ProductDataContext } from "../context/ProductContext";
import { IoChevronForward } from "react-icons/io5";
import FilterSortUI from "./FilterSortUi";
import ProgressLoader from "../utils/ProgressLoader";
import { CustomerDataContext } from "../context/CustomerContext";

const FlashSale = ({ allProduct, page, profile, setRemove }) => {
    const { search } = useLocation()
    const { addWishlist, removeWishlist } = useContext(CustomerDataContext)
    const { bestSellingProducts, getProducts, TrendingProducts, PopularProducts } = useContext(ProductDataContext)
    const navigate = useNavigate()
    const [products, setProducts] = useState(null)
    const productsRef = useRef()
    const [arrowVisible, setArrowVisible] = useState(true);
    const [wishlist, setWishlist] = useState({});
    const [timeLeft, setTimeLeft] = useState(() => {
        // Get today's date at midnight
        const today = new Date();
        today.setHours(24, 0, 0, 0);
        // Get saved end time or set to end of day if not saved
        const savedEndTime = localStorage.getItem('flashSaleEndTime');
        const endTime = savedEndTime ? parseInt(savedEndTime) : today.getTime();
        // If saved time is in the past, set new end time to next midnight
        if (endTime <= Date.now()) {
            const newEndTime = today.getTime();
            localStorage.setItem('flashSaleEndTime', newEndTime.toString());
            return calculateTimeLeft(newEndTime);
        }
        return calculateTimeLeft(endTime);
    });
    const [activeCategory, setActiveCategory] = useState("All");
    const types = ["All", "Newest", "Popular", "Trending", "Best Selling"];

    useEffect(() => {
        if (profile) {
            profile?.wishlist?.forEach(p => {
                setWishlist(prev => ({ ...prev, [p]: true }));
            });
        }
        if (!search) {
            setActiveCategory("All");
            return;
        }
        // normalize query string
        const normalizedSearch = decodeURIComponent(search).toLowerCase();
        const matched = types.find(
            (type) => normalizedSearch.endsWith(type.toLowerCase())
        );
        if (matched) {
            setActiveCategory(matched);
        } else {
            setActiveCategory("All");
        }
    }, []);

    function calculateTimeLeft(endTime) {
        const total = endTime - Date.now();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        return { hours, minutes, seconds };
    }

    const toggleWishlist = (id) => {
        if (!profile) return navigate('user/login');
        if (wishlist[id]) {
            removeWishlist(id).then(res => {
                setWishlist((prev) => ({ ...prev, [id]: false }))
                setRemove && setRemove(res)
            })
        } else {
            addWishlist(id).then(res => {
                setWishlist((prev) => ({ ...prev, [id]: true }))
            })
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star
                    key="half"
                    className="w-3 h-3 fill-yellow-400/50 text-yellow-400"
                />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
        }

        return stars;
    };

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            const endTime = Number(localStorage.getItem('flashSaleEndTime'));

            if (Date.now() >= endTime) {
                // Set new end time to next midnight
                const tomorrow = new Date();
                tomorrow.setHours(24, 0, 0, 0);
                localStorage.setItem('flashSaleEndTime', tomorrow.getTime().toString());
                setTimeLeft(calculateTimeLeft(tomorrow.getTime()));
            } else {
                setTimeLeft(calculateTimeLeft(endTime));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Map category name to handler function for no if condition repeated
        const categoryHandlers = {
            "All": () => {
                setProducts(allProduct);
            },
            "Best Selling": async () => {
                const data = await bestSellingProducts();
                if (data) setProducts(data);
            },
            "Newest": async () => {
                const data = await getProducts(1, 8, "sort=newest");
                if (data) setProducts(data.products);
            },
            "Popular": async () => {
                const data = await PopularProducts();
                if (data) setProducts(data);
            },
            "Trending": async () => {
                const data = await TrendingProducts();
                if (data) setProducts(data);
            },
        };
        const handler = categoryHandlers[activeCategory];
        if (handler) handler();
        else setProducts(allProduct); // fallback
    }, [activeCategory, allProduct]);

    return (products ?
        <section className=" py-4 select-none px-4 lg:px-10">
            {page ? null : <div className="mb-5 mt-6 ">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
                        Flash Sale⚡
                    </h1>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 animate-bounce duration-1000">
                        <Clock className="w-4 h-4" />
                        <span className="hidden md:block uppercase">Ends in </span>
                        <span>
                            {String(timeLeft.hours).padStart(2, '0')}:
                            {String(timeLeft.minutes).padStart(2, '0')}:
                            {String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>}

            {/* Category Filter */}
            {!page && <div id="categoryscroll" className="flex gap-2 items-center text-sm overflow-x-auto mb-4 mt-2">
                {types.map((category) => (
                    <button
                        key={category}
                        onClick={() => {
                            setActiveCategory(category)
                            navigate(`/?type=${category.toLowerCase()}`, { replace: true })
                        }}
                        className={`rounded-full cursor-pointer py-0.5 px-3 whitespace-nowrap transition-all duration-300 font-medium ${activeCategory === category
                            ? "bg-gradient-to-r from-amber-800 to-orange-700 text-white shadow-lg transform scale-105"
                            : "border border-orange-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50"
                            }`}>
                        {category}
                    </button>
                ))}
            </div>}

            {/* Products Grid */}
            <section ref={productsRef} className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 lg:gap-4 ${page ? "mt-2" : "mt-6"}`}>
                {products?.map((p, i) => (
                    <NewCard profile={profile} toggleWishlist={toggleWishlist} key={i} product={p} wishlist={wishlist} renderStars={renderStars} />
                ))}
            </section>

            {/* {arrowVisible && (<div className="bg-[#ecececdd] z-1 rotate-90 rounded-full  h-10 p-2 ">
                <IoChevronForward onClick={() => {
                    if (bestRef.current) {
                        bestRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                    }
                    setArrowVisible(false);
                }} size={30} />
            </div>)} */}

            {/* View More Button */}
            {!page && <div className="text-center mt-6">
                <Link to={'/product/all'} className="bg-white border-2 text-sm inline-block border-amber-900 text-amber-900 hover:bg-amber-800 cursor-pointer hover:text-white font-semibold py-1 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                    View All Products
                </Link>
            </div>}
        </section> : <ProgressLoader response={products} />
    );
};

export default FlashSale;
