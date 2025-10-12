import { useState, useEffect, useContext } from 'react';
import {
    Package,
    Clock,
    CheckCircle,
    Truck,
    Calendar,
    MapPin,
    Phone,
    ArrowLeft,
    Copy,
    ExternalLink,
    Loader,
    ShoppingBag,
    Box,
    Check,
    Bike,
    RotateCcw,
    Cross,
    CrossIcon,
} from 'lucide-react';



import { BsInstagram, BsWhatsapp } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerDataContext } from '../context/CustomerContext';

const TrackOrder = () => {
    const { getOrderDetails } = useContext(CustomerDataContext)
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const { orderId } = useParams()
    const [timeline, setTimeline] = useState(null)

    useEffect(() => {
        getOrderDetails(orderId).then(res => {
            setOrderData(res)
            setLoading(false)
        }).catch(err => console.log(err.response.data))
    }, []);

    useEffect(() => {
        if (orderData) {
            const currentStatus = orderData.status.toLowerCase();
            const statusMap = {
                'pending': 0,
                "confirmed": 1,
                'processing': 2,
                'shipped': 3,
                'out for delivery': 4,
                'delivered': 5,
                'cancelled': 3
            };
            const currentStep = statusMap[currentStatus] || 0;
            setTimeline([
                {
                    status: "Order Placed",
                    description: "We've received your order.",
                    timestamp: orderData.createdAt,
                    completed: true, // First step is always completed
                    current: currentStep === 0,
                    icon: ShoppingBag
                },
                {
                    status: "Confirmed",
                    description: "Your order has been Confirmed.",
                    timestamp: currentStep > 0 ? orderData.updatedAt : null,
                    completed: currentStep > 0,
                    current: currentStep === 1,
                    icon: Box
                },
                {
                    status: "Processing",
                    description: "Your order is being prepared.",
                    timestamp: currentStep > 1 ? orderData.updatedAt : null,
                    completed: currentStep > 1,
                    current: currentStep === 2,
                    icon: Box
                },
                {
                    status: orderData.status === 'cancelled' ? "Cancelled" : "Shipped",
                    description: orderData.status === 'cancelled' ? "Your order has been Cancelled."  : "Your package is on its way.",
                    timestamp: currentStep > 2 ? orderData.updatedAt : null,
                    completed: currentStep > 2,
                    current: currentStep === 3,
                    icon: Truck
                },
                {
                    status: "Out for Delivery",
                    description: "Your package is out for Delivery.",
                    timestamp: currentStep > 3 ? orderData.updatedAt : null,
                    completed: currentStep > 3,
                    current: currentStep === 4,
                    icon: Bike
                },
                {
                    status: "Delivered",
                    description: "Package has been delivered.",
                    timestamp: currentStep > 4 ? orderData.updatedAt : null,
                    completed: currentStep === 5,
                    current: currentStep === 5,
                    icon: Check
                }
            ]);
        }
    }, [orderData]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'processing':
                return <Package className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <Cross className="w-4 h-4 rotate-45" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You can add a toast notification here
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-amber-200 rounded-lg w-64"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-amber-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-amber-200 rounded w-48"></div>
                                            <div className="h-3 bg-amber-100 rounded w-32"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen bg-amber-50/20 p-4 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-amber-900 mb-2">Order Not Found</h2>
                    <p className="text-amber-700">Please check your order ID and try again.</p>
                </div>
            </div>
        );
    }

    return (orderData &&
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
            <div className="max-w-6xl mx-auto md:px-4 px-2 py-4">
                {/* Header */}
                <div className="mb-4 pl-2">
                    <button className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-2 font-medium transition-colors">
                        <ArrowLeft onClick={() => navigate(-1)} className="w-5 h-5" />
                        Back to Orders
                    </button>
                    <h1 className="text-2xl font-bold text-amber-900 leading-none">Track Your Order</h1>
                    <p className="text-amber-700">Follow your package journey in real-time</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Tracking Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-3xl shadow-xl md:p-8 p-4 border border-amber-200/50">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl whitespace-nowrap mb-1 font-semibold text-amber-900">
                                        Order #{orderId.slice(-10)}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`bg-gradient-to-r flex items-center gap-2 ${getStatusColor(orderData.status)} px-4 py-1 rounded-full font-semibold text-sm border border-amber-300 capitalize`}>
                                            {getStatusIcon(orderData.status)}{orderData.status}
                                        </span>
                                    </div>
                                    {orderData.status !== 'delivered' && <div className="flex items-center gap-2 text-amber-700">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">Expected Delivery: <span className='whitespace-nowrap'>{formatDate(new Date(new Date(orderData.updatedAt).setDate(
                                            new Date(orderData.createdAt).getDate() + 5
                                        )))}</span>
                                        </span>
                                    </div>}
                                </div>
                                <div className="md:text-right text-center">
                                    <div className="text-xl font-bold text-amber-900">₹{orderData.totalAmount.toLocaleString()}</div>
                                    <div className="text-sm text-amber-600">Total Amount</div>
                                </div>
                            </div>

                            {/* Tracking Number */}
                            <div className="bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-amber-900 mb-1">Tracking Number</h3>
                                        <p className="text-amber-800 font-mono text-lg">{orderData.shippingAddress._id.slice(-15)}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(orderData.shippingAddress._id)}
                                        className="p-2 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors">
                                        <Copy className="w-5 h-5 text-amber-800" />
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-amber-900 mb-3">Order Timeline</h3>
                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute h-[95%] left-6 top-0 w-0.5   bg-amber-200">
                                        {/* Active Timeline Line */}
                                        <div className="  w-0.5 bg-amber-500 transition-all duration-500"
                                            style={{
                                                height: `${timeline?.findIndex(t => t.current) * 20}%`,
                                                opacity: timeline?.some(t => t.current) ? 1 : 0
                                            }}></div>
                                    </div>

                                    {/* Timeline Steps */}
                                    {timeline?.map((step, index) => <div key={index} className="relative flex items-start gap-4 pb-8 last:pb-0">
                                        {/* Icon */}
                                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300  ${step.completed
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-200 text-white'
                                            : step.current
                                                ? 'bg-white border-amber-500 text-amber-600 ring-4 ring-amber-200'
                                                : 'bg-gray-100 border-gray-200 text-gray-400'
                                            }`}>
                                            {step.current && !step.completed ? (
                                                <Loader className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <step.icon className="w-5 h-5" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-semibold ${step.completed || step.current ? 'text-amber-900' : 'text-gray-500'
                                                }`}>
                                                {step.status}
                                            </div>
                                            <p className={`text-sm mt-1 ${step.completed || step.current ? 'text-amber-800' : 'text-gray-400'
                                                }`}>
                                                {step.description}
                                            </p>
                                            {step.timestamp && (
                                                <p className="text-xs text-amber-700  font-medium">
                                                    {formatDate(step.timestamp)}
                                                </p>
                                            )}
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Delivery Info */}
                        {orderData.shippingAddress && <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 border border-amber-200/50">
                            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Delivery Address
                            </h3>
                            <div className="space-y-2 text-amber-800">
                                <p className="font-semibold capitalize">{orderData.shippingAddress.fullName}</p>
                                <p className="text-sm">{orderData.shippingAddress.street}</p>
                                <p className="text-sm">
                                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}
                                </p>
                                <div className="flex items-center gap-1 mt-3">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm font-medium">{orderData.shippingAddress.phone}</span>
                                </div>
                            </div>
                        </div>}

                        {/* Courier Info */}
                        {orderData.courier && <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-200/50">
                            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Courier Details
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-amber-900">{orderData.courier}</p>
                                    <p className="text-sm text-amber-700">Delivery Partner</p>
                                </div>
                                <div className="flex items-center gap-2 text-amber-700">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">{orderData.courierPhone}</span>
                                </div>
                                <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Track on Courier Site
                                </button>
                            </div>
                        </div>}

                        {/* Order Items */}
                        {orderData.items && <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 border border-amber-200/50">
                            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Items
                            </h3>
                            <div className="space-y-4">
                                {orderData.items.map((item) => (
                                    <div key={item.product._id} className="flex gap-3 p-3 bg-amber-50 rounded-2xl">
                                        <img
                                            src={item.product.productimage[0]}
                                            alt={item.product.title}
                                            className="w-16 h-16 object-cover rounded-xl border-2 border-amber-200" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-amber-900 text-base line-clamp-2">{item.product.title}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm text-amber-600 font-semibold">Qty: {item.quantity}</span>
                                                <span className="font-bold text-amber-900">₹{item.price?.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}

                        {/* Help Section */}
                        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl shadow-xl p-4 md:p-6 border border-amber-200/50">
                            <h3 className="text-xl font-bold text-amber-900 mb-4">Need Help?</h3>
                            <div className="space-y-3">
                                <button onClick={() => {
                                    window.location.href = "tel:+918591066134"
                                }} className="w-full bg-white hover:bg-amber-50 text-amber-900 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Call Support
                                </button>
                                <button onClick={() => {
                                    const phone = "918591066134";
                                    const msg = encodeURIComponent("Hello, I need support regarding my orders.");
                                    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                                }} className="w-full bg-white hover:bg-amber-50 text-green-600 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <BsWhatsapp className="w-4 h-4" />
                                    Whatsapp Support
                                </button>
                                <button onClick={() => {
                                    window.open(`https://www.instagram.com/direct/t/17846960730464012/`, "_blank")
                                }} className="w-full bg-white hover:bg-amber-50 text-pink-500 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                    <BsInstagram className="w-4 h-4 " />
                                    Instagram Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;