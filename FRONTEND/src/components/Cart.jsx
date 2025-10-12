import { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { removeFromCartLocal } from "../utils/local.cart";
import { ProductDataContext } from "../context/ProductContext";
import { Link, replace, useNavigate } from "react-router-dom";
import { BsCartX } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { CustomerDataContext } from "../context/CustomerContext";

const Cart = () => {
    const navigate = useNavigate();
    const [loadingItems, setLoadingItems] = useState({});
    let cart = JSON.parse(localStorage.getItem("cart"));
    const [cartItems, setcartItems] = useState([]);
    const { lengthc, setlengthc, singleProduct } = useContext(ProductDataContext);
    const [outstock, setoutstock] = useState({});
    const [estimatedTotal, setestimatedTotal] = useState(0.0);
    const [warn, setWarn] = useState(false)
    const { getCartItems, updateCart, removeFromCart, profile, syncCartToDB } = useContext(CustomerDataContext)

    async function SetInDbAndFetch() {
        if (cart) {
            await syncCartToDB()
            console.log('synced.');
            getCartItems().then(res => { setcartItems(res) }).catch(err => { console.log(err.response.data); })
        }
        if (cart === null) {
            getCartItems().then(res => { setcartItems(res) }).catch(err => { console.log(err.response.data); })
        }
    }

    useEffect(() => {
        if (profile) {
            SetInDbAndFetch()
        }
        if (cart) {
            setcartItems(cart)
        }
    }, [lengthc, profile]);

    const checkStock = async (cartItems) => {
        const outOfStock = {};
        cartItems.forEach(c => {
            // Quantity string hai to number me convert karke check karo
            const qty = Number(c?.product?.quantity);
            if (qty <= 0) {
                outOfStock[c.product.title] = true;
            }
        });
        if (Object.keys(outOfStock).length === 0) {
            setWarn(false)
        }
        setoutstock(outOfStock);
    };

    useEffect(() => {
        if (cartItems.length && profile) {
            checkStock(cartItems)
        }
        setestimatedTotal(cartItems?.reduce((total, item) => total + (item?.product?.price || item?.price) * item?.quantity, 0));
    }, [cartItems])

    return cartItems.length > 0 ? (
        <div className="max-w-3xl mx-auto p-4 font-sans relative bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-amber-950">
                    Your Cart
                </h2>
                <Link to="/product/all"
                    className="text-sm font-medium text-amber-700 underline hover:text-orange-400 flex items-center gap-1 transition">
                    Continue Shopping
                    <FaArrowRightLong size={8} />
                </Link>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
                {cartItems?.map((item, i) => {
                    return <div key={i} className="flex items-center py-5 w-full ">
                        {/* Product Image */}
                        <img onClick={() => navigate(`/product/${item.product?._id || item._id}`)}
                            src={item?.product?.productimage[0] || item?.productimage[0]}
                            alt={item?.product?.title || item?.title}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform" />

                        {/* Product Details */}
                        <div className=" w-10/12 ml-4 overflow-hidden  ">
                            <h3 className="md:text-lg truncate font-medium capitalize text-gray-800">
                                {item?.product?.title || item?.title}
                            </h3>
                            <p className="text-sm text-gray-500">Rs. {item?.product?.price || item.price}</p>
                            {profile && outstock[item?.product?.title] && (
                                <span className="text-red-500  text-xs font-bold capitalize">
                                    Out of stock
                                </span>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center mt-3">
                                {/* Decrement */}
                                <button
                                    onClick={async () => {
                                        const itemId = item.product?._id || item._id;
                                        if (loadingItems[itemId]) return; // Prevent if loading

                                        try {
                                            setLoadingItems(prev => ({ ...prev, [itemId]: true }));

                                            if (profile) {
                                                if (item.quantity > 1) {
                                                    await updateCart(item.product._id, item.quantity - 1);
                                                    setcartItems(await getCartItems());
                                                }
                                            } else {
                                                // Guest user
                                                if (item.quantity > 1) {
                                                    const updatedCart = cartItems.map(c =>
                                                        c._id === item._id ? { ...c, quantity: c.quantity - 1 } : c
                                                    );
                                                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                                                    setcartItems(updatedCart);
                                                    setlengthc(updatedCart.length);
                                                }
                                            }
                                        } finally {
                                            setLoadingItems(prev => ({ ...prev, [itemId]: false }));
                                        }
                                    }}
                                    disabled={item.quantity <= 1 || loadingItems[item.product?._id || item._id]}
                                    className={`w-8 h-8 border border-gray-300 rounded-l 
            ${loadingItems[item.product?._id || item._id]
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : 'hover:bg-gray-100 cursor-pointer'}`}>
                                    -
                                </button>
                                {/* Quantity Display */}
                                <span className="px-4 text-sm">{item.quantity}</span>
                                {/* Increment */}
                                <button
                                    onClick={async () => {
                                        if (profile && item.product.quantity == item.quantity) {
                                            alert(`This Product has Only ${item.quantity} Stocks. `)
                                            return;
                                        }
                                        const itemId = item.product?._id || item._id;
                                        if (loadingItems[itemId]) return; // Prevent if loading
                                        try {
                                            setLoadingItems(prev => ({ ...prev, [itemId]: true }));
                                            if (profile) {
                                                await updateCart(item.product._id, item.quantity + 1);
                                                setcartItems(await getCartItems());
                                            } else {
                                                // Guest user
                                                const updatedCart = cartItems.map(c =>
                                                    c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
                                                );
                                                localStorage.setItem("cart", JSON.stringify(updatedCart));
                                                setcartItems(updatedCart);
                                                setlengthc(updatedCart.length);
                                            }
                                        } finally {
                                            setLoadingItems(prev => ({ ...prev, [itemId]: false }));
                                        }
                                    }}
                                    disabled={loadingItems[item.product?._id || item._id]}
                                    className={`w-8 h-8 border border-gray-300 rounded-r ${loadingItems[item.product?._id || item._id] ? ' cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                                    +
                                </button>

                                {/* Delete Button */}

                                <button onClick={async () => {
                                    if (profile) {
                                        await removeFromCart(item.product?._id);
                                        setlengthc(cartItems.length - 1);
                                    } else {
                                        removeFromCartLocal(item._id);
                                        const updatedCart = cartItems.filter(c => c._id !== item._id);
                                        setcartItems(updatedCart);
                                        setlengthc(updatedCart.length);
                                    }
                                }}
                                    disabled={loadingItems[item.product?._id || item._id]}
                                    className={`ml-5 text-xl text-red-500 hover:text-orange-500 cursor-pointer transition`}>
                                    <MdDelete />
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="ml-4 whitespace-nowrap text-base font-semibold text-gray-800">
                            Rs. {item?.product?.price * item?.quantity || item.price * item.quantity}
                        </div>
                    </div>
                }
                )}
            </div>

            {/* Summary */}
            <div className="pt-6 text-right border-t border-gray-200 mt-6">
                <p className="text-gray-700 text-base mb-2">
                    Estimated Total:{" "}
                    <span className="font-bold text-lg">Rs. {estimatedTotal}</span>
                </p>
                <p className="text-xs text-gray-500 mb-4">
                    Taxes included. Discounts and{" "}
                    <a className="underline cursor-pointer">shipping</a> calculated at
                    checkout.
                </p>
                {warn && (
                    <div className="text-center w-full md:w-fit bg-gradient-to-bl from-red-500 via-red-600 to-red-700 text-base font-semibold rounded-2xl left-1/2 -translate-x-1/2 px-6 py-2 fixed top-1 z-50 leading-6 text-gray-100 shadow-2xl border-2 border-red-400 capitalize">
                        <div className="flex items-center justify-center gap-2 mb-2 ">
                            <span className="text-yellow-300 text-sm font-bold">⚠️ ACTION REQUIRED</span>
                        </div>
                        Some items in your cart are <span className=" px-1 rounded-lg text-yellow-200 font-semibold text-sm truncate ">OUT OF STOCK.</span>Please <span className=" px-2  rounded-md  bg-red-900 font-bold text-sm">REMOVE</span> them to <span className="  text-green-300 font-semibold text-sm">  Continue.</span>
                    </div>
                )}

                <button
                    onClick={() => {
                        if (Object.keys(outstock).length <= 0) {
                            navigate("/checkout/cart");
                        } else {
                            setWarn(true)
                        }
                    }}
                    className={`${Object.keys(outstock).length > 0 ? "bg-gray-500" : "bg-amber-900"
                        } hover:bg-amber-700 text-white px-6 py-2 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105`}>
                    Check Out
                </button>
            </div>
        </div>
    ) :
        <div className="h-screen flex flex-col justify-center items-center gap-6 bg-gradient-to-b from-orange-100 to-rose-200 text-gray-800 p-6">
            {/* Icon */}
            <div className="bg-amber-50 p-6 rounded-full shadow-md">
                <BsCartX className="text-6xl text-red-600" />
            </div>

            {/* Text */}
            <h1 className="font-bold text-amber-900 uppercase text-2xl md:text-3xl text-center tracking-wide">
                Your cart is empty
            </h1>
            <p className="text-amber-700 text-center max-w-md">
                Looks like you haven't added anything to your cart yet.
            </p>

            {/* Button */}
            <Link to="/product/all" className="mt-4 bg-gradient-to-tr from-rose-500 to-orange-500 hover:shadow-2xs text-amber-100 px-6 py-3 rounded-full shadow-md transition-transform transform hover:scale-105 flex items-center gap-2">
                Continue Shopping
                <FaArrowRightLong size={18} />
            </Link>
        </div>

};
export default Cart;
