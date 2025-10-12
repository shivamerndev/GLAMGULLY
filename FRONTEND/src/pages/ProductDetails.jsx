import { useContext, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { FaMoneyBillWave, FaStar } from "react-icons/fa";
import { ProductDataContext } from "../context/ProductContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addCartWithQuantity } from "../utils/local.cart";
import Loader from '../../src/assets/loader.gif';
import axios from "axios";
import RateBox from "../components/Ratebox";
import BackTitle from "../components/BackTitle";
import { Heart } from "lucide-react";
import AnimatedCartButton from '../components/AnimatedCartButton'
import FlashSale from '../components/FlashSale'
import { toast, ToastContainer } from 'react-toastify'
import ImojiDetails from "../components/DetailsImogi.jsx";
import ProgressLoader from "../utils/ProgressLoader.jsx";
import ZoomedImage from "../components/ZoomedImage.jsx";
import { CustomerDataContext } from "../context/CustomerContext.jsx";

const ProductDetails = () => {
    const navigate = useNavigate()
    const { productId } = useParams()
    const { state } = useLocation()
    const { singleProduct, setlengthc, getProducts } = useContext(ProductDataContext)
    const { profile, addToCart, addWishlist, removeWishlist } = useContext(CustomerDataContext)
    const [p, setp] = useState(null)
    const [rateBox, setrateBox] = useState(false || state)
    const [recp, setRecp] = useState(null)
    const [comment, setComment] = useState("")
    const [quantity, setQuantity] = useState(1);
    const [Starquantity, setStarquantity] = useState(0);
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const [ratting, setRatting] = useState(null)
    const [wishlist, setWishlist] = useState(false)

    const toggleWishlist = () => {
        if (!profile) return navigate('user/login');
        if (wishlist) {
            removeWishlist(productId).then(res => {
                setWishlist(false)
            })
        } else {
            addWishlist(productId).then(res => {
                setWishlist(true)
            })
        }
    };
    // Also update the increment function to prevent going over stock
    const increment = () => {
        if (!p || quantity >= p.quantity) {
            toast.error(` Only ${p ? p.quantity : 0} items available in stock `);
            return;
        }
        setQuantity(q => q + 1);
    };
    const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
    const [popupImg, setPopupImg] = useState(true)

    useEffect(() => {
        if (profile) {
            setWishlist(profile.wishlist.includes(productId))
        }
    }, [profile])

    useEffect(() => {
        setQuantity(1);
        setCurrent(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (state) {
            setComment("Nice Product.")
        }
    }, [p, state]);

    useEffect(() => {
        singleProduct(productId).then(data => {
            if (data) {
                setp(data)
                setRatting(p?.ratings)
            }
        }).catch(err => console.log(err))
    }, [productId, rateBox]);

    useEffect(() => {
        getProducts().then(data => {
            const filtered = (data?.products.filter(item => item._id !== productId && item.category === p?.category))
            if (filtered?.length === 0) {
                setRecp(data.products.splice(0, 6).filter(item => item._id !== productId))
            } else {
                setRecp(filtered)
            }
        }).catch(err => console.log(err))
    }, [p])

    const addPqCart = () => {
        if (profile) {
            addToCart(productId, quantity).then(res => setlengthc(res.length)).catch(err => { console.log(err.response.data); })
        } else {
            addCartWithQuantity(p, quantity)
            const cart = JSON.parse(localStorage.getItem("cart"))
            setlengthc(cart?.length)
        }
    }

    const buyNow = (p) => {
        try {
            navigate(`/checkout/${p._id}?quantity=${quantity}`);
        } catch (error) {
            console.log(error)
        }
    }
    // comment related functions
    const CommentCreate = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/review/create`, {
                productId,
                text: comment,
                star: Starquantity // Assuming a default star rating of 3, you can modify this as needed
            })
            setComment("")
            setStarquantity(0)
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

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
            // swipe left
            setCurrent((prev) => (prev + 1) % p?.productimage?.length);
        } else if (deltaX < -50) {
            // swipe right
            setCurrent((prev) => (prev === 0 ? p?.productimage?.length - 1 : prev - 1));
        }
    };

    useEffect(() => {
        if (!p) return; // Guard clause if product isn't loaded yet

        if (p.quantity <= 0) {
            setQuantity(0); // Set quantity to 0 for out of stock items
            return;
        }
        if (quantity > p.quantity) {
            setQuantity(p.quantity); // Set quantity to max available
            toast.warn(`Only ${p.quantity} items available in stock`);
        }
    }, [quantity, p]);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-amber-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [showFullDescription, setShowFullDescription] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setPosition({ x, y });
    };

    return (p ?
        <div className="min-h-screen text-black w-full mb-8 ">
            <ToastContainer />
            {isZoomed && <ZoomedImage position={position} img={isZoomed} />}
            <ToastContainer />
            {rateBox && <RateBox create={CommentCreate} Starquantity={Starquantity} setStarquantity={setStarquantity} setrateBox={setrateBox} />}
            <BackTitle page="Product Details" toggleWishlist={toggleWishlist} icon={<Heart className={`w-4 h-4 transition-colors duration-300 ${wishlist ? "fill-amber-900 text-amber-900" : "text-gray-600 hover:text-red-500"}`} />} />


            <section className="w-full sm:w-10/12 md:w-full mx-auto px-2  lg:px-6 mt-4 md:flex md:justify-between lg:gap-8 ">
                {/* LEFT: Product Image Carousel */}
                <div ref={containerRef} onMouseMove={handleMouseMove} onMouseEnter={(e) => setPopupImg(true)} onMouseLeave={(e) => setPopupImg(false)} className="relative w-full md:w-1/2 h-[60vmin] md:h-[70vmin] rounded-2xl overflow-hidden shadow-md"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}>

                    {popupImg && (<span className="bg-white/30 hidden md:block w-1/5 h-1/5 rounded-md absolute z-10 pointer-events-none "
                        style={{ left: position.x * 5, top: position.y * 3.5 }}></span>
                    )}

                    <div style={{ transform: `translateX(-${current * 100}%)` }} className="flex w-full cursor-none h-full transition-transform duration-700 ease-in-out">
                        {p?.productimage.map((img, idx) => (
                            <div onMouseEnter={() => setIsZoomed(img)}
                                onMouseLeave={() => setIsZoomed(false)} key={img} className="w-full shrink-0 h-full">
                                <img className="h-full w-full object-cover object-center"
                                    src={img} alt={`product-${idx}`} />
                            </div>
                        ))}
                    </div>

                    <div className={`${popupImg ? "bottom-10" : "bottom-0 opacity-0"} transition-all ease-in-out duration-300 absolute  left-1/2 -translate-x-1/2 h-1/6 bg-amber-50/10 rounded-md hidden  sm:flex overflow-hidden shadow-2xl backdrop-blur-2xl`}>
                        {p?.productimage && p.productimage.map((img, idx) => (
                            <button key={idx} onClick={() => setCurrent(idx)} className={`w-20 h-full cursor-pointer shrink-0 rounded-sm ${current === idx ? "border-amber-100  border-2 " : ""}`}>
                                <img className="h-full w-full object-cover   object-center " src={img} alt={idx} />
                            </button>
                        ))}
                    </div>

                    <span onClick={handleSwipe} className="absolute bottom-3 left-1/2 -translate-x-1/2 w-fit pointer-events-none bg-amber-950/50 /60 text-amber-100 px-3 py-0.5 rounded-full text-sm font-semibold">
                        {current + 1} / {p.productimage.length}
                    </span>
                </div>

                {/* RIGHT: Product Info */}
                <div style={{ color: p?.quantity <= 0 ? "lightgray" : "" }} className="w-full md:w-1/2 mt-4 md:mt-0 text-amber-950 px-2 lg:px-8 ">
                    <p className="uppercase text-xs font-bold tracking-wider mb-4 text-amber-900 bg-amber-50 rounded-full inline-block">GLAMGULLY</p>
                    <h1 className="text-xl font-bold capitalize mb-2">{p?.title}</h1>

                    {/* Rating Section - NEW */}
                    <div className="flex items-center space-x-3 mb-2">
                        {renderStars(ratting)}
                        <span className="text-amber-700 text-sm font-medium">
                            {ratting} ({p?.reviewsCount} reviews)
                        </span>
                    </div>

                    {p?.quantity <= 0 && (
                        <span className="text-red-600 text-base font-bold bg-red-50 px-3 rounded-lg">Out of stock</span>
                    )}

                    {/* Price Section */}
                    <div className="flex items-center gap-3 bg-amber-50 py-2 px-4 rounded-xl mt-2 mb-1">
                        <del className="text-amber-700 text-base">₹ 499.00</del>
                        <span className="text-2xl font-bold text-amber-950">₹ {p?.price}.00</span>
                        <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                            {(Number(p.discount) || 0) + 50}% OFF
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-amber-950 text-sm md:text-base bg-amber-25  my-3 xs:leading-4 md:leading-normal">
                        {showFullDescription ? p?.description : (p?.description?.length < 140 ? p?.description : p?.description?.slice(0, 140))}
                        {p?.description?.length > 140 && (
                            <span onClick={() => setShowFullDescription(!showFullDescription)} className="text-sky-500 text-sm cursor-pointer whitespace-nowrap leading-0 ml-1">
                                {showFullDescription ? 'show less' : 'show more...'}
                            </span>)}
                    </p>


                    {/* Quantity Selector */}
                    <div>
                        <label className="block mb-1 font-medium text-amber-900">Quantity</label>
                        <div className="flex items-center border-2 border-amber-300 rounded-lg overflow-hidden w-fit bg-white">
                            <button
                                onClick={decrement}
                                className="px-4 py-1 text-lg font-bold hover:bg-amber-100 text-amber-700 transition-colors"
                            >
                                −
                            </button>
                            <span className="px-5 py-1 text-lg bg-amber-50 text-amber-950">
                                {p?.quantity <= 0 ? 0 : quantity}
                            </span>
                            <button
                                onClick={increment}
                                className="px-4 py-1 text-lg font-bold hover:bg-amber-100 text-amber-700 transition-colors">
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-4">
                        <AnimatedCartButton pd={addPqCart} product={p} />

                        {/* Buy Button */}
                        <button onClick={() => {
                            if (p?.quantity <= 0) {
                                toast.error("Product is out of stock");
                            } else {
                                buyNow(p);
                            }
                        }}
                            className={`w-full block ${p?.quantity <= 0
                                ? "bg-rose-200 cursor-not-allowed"
                                : "bg-gradient-to-bl from-amber-700 to-zinc-700  hover:bg-green-700 shadow-lg hover:shadow-xl"
                                } text-white rounded-full text-base flex justify-center items-center gap-4 cursor-pointer mb-2 hover:scale-105 font-semibold py-2 text-center transition-all duration-300`}>
                            <FaMoneyBillWave />Buy it now
                        </button>
                    </div>
                    <ImojiDetails />
                </div>

            </section>

            <section className="text-amber-950  w-full">
                {recp && <div>
                    <h1 className="text-xl px-4 font-semibold mt-4">You may also like</h1>
                    <FlashSale allProduct={recp} page={'recommend'} />
                </div>}

                <h1 className="text-lg px-4 font-semibold my-4">Reviews :  {String(p?.reviewsCount).padStart(2, '0')}</h1>
                <div className="relative w-10/11  mx-4 md:mx-8">
                    <textarea autoFocus value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder="Write your opinion. "
                        className=" w-full h-12 px-4 pr-10 py-2 border-2 border-t-0 border-r-0 border-amber-950 text-amber-900 font-semibold outline-none rounded-lg transition"></textarea>
                    {comment.length !== 0 && <p onClick={() => setrateBox(true)} className="bg-amber-800 cursor-pointer px-2 text-white rounded-full font-semibold select-none absolute right-2 top-3 text-center ">send</p>}
                </div>
                {p.reviews && p.reviews.map((c, i) =>
                    <div key={i} className="w-10/11 mx-auto my-4 bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-3 rounded-lg shadow flex md:mx-8 justify-start items-start">
                        <div className=" space-y-2">
                            <div className="flex space-x-1 ">
                                {[...Array(c.star)].map((_, i) => (
                                    <FaStar onClick={() => {
                                        console.log(i + 1, 'sense good.');
                                    }} key={i} size={14} className="text-yellow-500" />
                                ))}
                            </div>
                            <p className="text-base text-amber-950 font-semibold">{c.text}</p>
                        </div>
                    </div>)}


            </section>

            {/* <footer className="fixed bottom-0 left-0 z-10 bg-amber-50 rounded-xl py-1 w-full items-center flex justify-between font-semibold text-base">
                <h1 className="px-4 w-1/3">Total Price ₹299.00</h1>
                <div className="w-1/2 pt-1.5" >
                    <AnimatedCartButton pd={addPqCart} product={p} />
                </div>
            </footer> */}
        </div> : <ProgressLoader response={p} />
    );
}
export default ProductDetails;