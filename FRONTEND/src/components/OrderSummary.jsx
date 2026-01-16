import { useContext, useEffect, useState } from "react";
import { ProductDataContext } from "../context/ProductContext";
import { CustomerDataContext } from "../context/CustomerContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { handlePayment } from "../pages/Payment";
import { ChevronDown, CreditCard, Info, Package, Tag, Truck } from "lucide-react"


const OrderSummary = ({ toggleHandle, isOpen = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = useParams()
    const { singleProduct } = useContext(ProductDataContext)
    const { getCartItems, createOrder, createOrderWithCart, sendNotification, getDiscount } = useContext(CustomerDataContext);
    const [product, setproduct] = useState(null)
    const [amount, setamount] = useState()
    const [updatedAmount, setupdatedAmount] = useState(0)
    const [buyquantity, setbuyquantity] = useState(1)
    const [discountCode, setDiscountCode] = useState("")
    const [couponStatus, setcouponStatus] = useState("")
    const [productfromCart, setProductFromCart] = useState(null)
    const params = new URLSearchParams(location.search)
    const customerAddress = params.get("address") || null;
    const finalprice = amount - updatedAmount

    useEffect(() => {
        if (productId) {
            setbuyquantity(params.get("quantity"))
            singleProduct(productId.split('&')[0]).then(data => {
                setproduct(data)
                setamount((data.price * params.get("quantity")).toFixed(2))
            })
        } else {
            getCartItems().then(res => setProductFromCart(res)).catch(err => console.log(err)
            )
        }
    }, [productId])

    // 1. Fix the amount calculation
    useEffect(() => {
        if (productfromCart?.length) {
            const totalPrice = productfromCart.reduce((acc, item) => {
                return acc + (Number(item?.product?.price) * Number(item?.quantity));
            }, 0);
            setamount(totalPrice.toFixed(2));
        }
    }, [productfromCart]);

    const CreateOrderFunction = () => {
        try {
            if (productId) {
                let obj = { shippingAddress: customerAddress, totalAmount: finalprice };
                obj = { ...obj, buyquantity: buyquantity, products: product }
                createOrder(obj).then(res => {
                    if (res) {
                        sendNotification({ title: "Glamgully", body: `🎉 NEW ORDER RECEIVED ✅\n Order ID: ${res._id}\n Amount: ₹${obj.totalAmount}` });
                        navigate("/product/all", { replace: true });
                    }
                }).catch(err => {
                    alert(err?.response.data)
                })
            } else {
                createOrderWithCart({ shippingAddress: customerAddress, totalAmount: amount }).then(res => navigate("/cart", { replace: true })).catch(err => { alert(err.response.data); navigate(-1) })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return ((product || productfromCart?.length) ?
        <div className=" max-w-xl mx-auto  bg-amber-50/50 select-none  rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
            {/* Enhanced Header */}
            <div className="flex justify-between items-center sm:px-4 py-3 px-2  hover:bg-amber-100/50 transition-all duration-300" >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-200 rounded-full">
                        <Package className="w-4 h-4 text-amber-700" />
                    </div>
                    <h2 onClick={toggleHandle} className="text-base cursor-pointer font-semibold text-amber-800 flex items-center gap-2">
                        Order Summary
                        {toggleHandle && <span className={`transform transition-transform duration-300 md:hidden ${isOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                        </span>}
                    </h2>
                </div>
                <div className="text-right">
                    <div className="text-xs text-amber-600 font-medium">Total Amount</div>
                    <div className="text-base font-bold text-amber-900">₹ {amount}</div>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent"></div>

            {/* Enhanced Dropdown Content */}

            <div className={` ${isOpen ? "block" : "hidden md:block"} sm:p-4 px-1 py-4 space-y-4 bg-gradient-to-b from-amber-50/50 to-amber-100/30`}>
                {/* Products Section */}
                <div className="space-y-4">
                    {productfromCart ? <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4" />
                        Items in your Cart
                    </h3> : <h3 className="text-sm font-semibold  text-amber-800 flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 shrink-0" />
                        Continue :- {product.title}
                    </h3>}

                    {productfromCart ?
                        productfromCart?.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(`/product/${item.product._id}`)}
                                className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-amber-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-300 cursor-pointer group">
                                <div className="relative">
                                    <img
                                        src={item?.product.productimage[0]}
                                        alt="Product"
                                        className="w-16 h-16 object-cover rounded-xl border-2 border-amber-200/50 group-hover:border-amber-300 transition-colors" />
                                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold shadow-lg">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-amber-900 truncate">{item.product.title}</p>
                                    <p className="text-xs text-amber-600 mt-1">₹ {item.product.price.toLocaleString()} each</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-amber-900">₹ {(item.product.price * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        )) :
                        <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-amber-200/50">
                            <div className="relative">
                                <img
                                    src={product?.productimage[0]}
                                    alt="Product"
                                    className="w-16 h-16 object-cover rounded-xl border-2 border-amber-200/50"
                                />
                                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-semibold shadow-lg">
                                    {buyquantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-amber-900">{product.title}</p>
                                <p className="text-xs text-amber-600 mt-1">₹{product.price.toLocaleString()} each</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-amber-900">₹ {amount.toLocaleString()}</p>
                            </div>
                        </div>
                    }
                </div>
                {!toggleHandle && <>
                    {/* Enhanced Discount Code */}
                    <div className="bg-white/60 rounded-2xl p-4 border border-amber-200/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Have a discount code?</span>
                        </div>
                        {couponStatus && <p className={` ${updatedAmount ? "text-green-500" : "text-red-500"} text-sm  mb-1 px-2 font-semibold flex items-center gap-2`}><span className={`text-sm text-white ${updatedAmount ? "hidden" : "bg-red-400"} rounded-full w-5 h-5 text-center  font-normal`}>&times;</span>{couponStatus}</p>}
                        <div className="flex gap-3">
                            <input
                                value={discountCode}
                                onChange={(e) => { setDiscountCode(e.target.value); setcouponStatus(""); setupdatedAmount(0); }}
                                type="text"
                                placeholder="Enter discount code"
                                className="flex-1 border-2 border-amber-200 text-amber-900 uppercase rounded-xl px-4 py-3 text-sm font-medium placeholder-amber-500 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                            />
                            <button onClick={() => {
                                if (discountCode === "" || discountCode.length < 4) return;
                                getDiscount(discountCode, +amount, product.category).then(res => {
                                    setcouponStatus(res.message);
                                    setupdatedAmount(Math.floor(res.discounted).toFixed(2));
                                }).catch(err => setcouponStatus(err.response.data.message))
                            }} className={`px-6 ${couponStatus && "pointer-events-none"} ${updatedAmount > 0 ? " from-green-500 to-green-600" : "from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"} py-3 bg-gradient-to-r  text-white text-sm font-semibold rounded-xl  transform hover:scale-105 transition-all duration-200 shadow-lg`}>
                              {updatedAmount > 0 ? "Applied" : "Apply"}
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Pricing Breakdown */}
                    <div className="bg-white/60 rounded-2xl p-4 border border-amber-200/50 space-y-5 mb-5">
                        <div className="flex justify-between items-center text-amber-800">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-semibold">₹{amount}</span>
                        </div>

                        <div className="flex justify-between items-center text-amber-800">
                            <span className="flex items-center gap-2 font-medium">
                                <Truck className="w-4 h-4" />
                                Shipping
                                <Info className="w-3 h-3 text-amber-500 cursor-help" />
                            </span>
                            <span className={`font-semibold ${customerAddress ? 'text-green-600' : 'text-amber-600'}`}>
                                {customerAddress ? "FREE" : "Calculate at Checkout"}
                            </span>
                        </div>

                        {updatedAmount > 0 && <div className="flex justify-between items-center text-green-600">
                            <span className="font-medium">Coupon Applied ✓</span>
                            <span className="font-semibold text-green-800">- ₹{updatedAmount}</span>
                        </div>}

                        <div className="h-px bg-amber-200/60"></div>

                        <div className="flex justify-between items-center text-amber-900 text-lg font-bold">
                            <span>Total</span>
                            <span>₹{finalprice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Enhanced Pay Button */}
                    <button
                        onClick={() => {
                            if (customerAddress) {
                                handlePayment(finalprice, CreateOrderFunction)
                            } else {
                                alert("Address Required.")
                            }
                        }}
                        className="md:max-w-sm w-full mx-auto cursor-pointer bg-gradient-to-r from-amber-800 via-amber-900 to-amber-800 text-white rounded-2xl py-4  text-center font-semibold text-lg hover:from-amber-900 hover:via-amber-950 hover:to-amber-900 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        Complete Payment
                    </button>
                </>}

            </div>

        </div> : <h1 className="px-5"> Products Not Found.</h1>
    );
};

export default OrderSummary;
