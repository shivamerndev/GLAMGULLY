import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AdminDataContext } from '../context/AdminContext';
import {
    Package,
    Truck,
    MapPin,
    Phone,
    ExternalLink,
    User2,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify'

const OrderDetails = () => {
    const { getOrderDetails, editOrderDetails } = useContext(AdminDataContext)
    const [orderData, setOrderData] = useState(null);
    const { orderId } = useParams()
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("")
    const [changed, setChanged] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        getOrderDetails(orderId).then(res => {
            setOrderData(res)
            setStatus(res.status)
            setChanged(res.status)
            setLoading(false)
        }).catch(err => console.log(err.response.data))
    }, []);

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

    const updateStatus = async (id, status) => {
        await editOrderDetails(id, status)
        toast.success(`Order Status Updated Successfully`)
        setTimeout(() => {
            navigate(-1)
        }, 2000);
    }

    return (<>
        <ToastContainer />
        <div className=" px-6 py-4 grid grid-cols-2 gap-8">
            <div className="bg-amber-50/50  rounded-3xl shadow-xl p-6 border border-amber-200/50" >
                <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
                    <User2 className="w-5 h-5" />
                    Customer ID:  #{orderData.customer}
                </h3>
            </div>

            <div className="bg-amber-50/50 rounded-3xl shadow-xl p-6 border border-amber-200/50" >
                <div className="text-base font-bold text-amber-900 flex items-center gap-2">
                    <h1> Order Status: </h1>
                    <select value={status}
                        onChange={(e) => { setStatus(e.target.value) }}
                        className="text-sm px-4 py-1 border-2 border-amber-300 bg-amber-100/90 rounded-xl focus:outline-none focus:border-amber-500 text-amber-800 font-medium">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {changed !== status && <button onClick={() => { updateStatus(orderId, status); setChanged(status) }} className='bg-yellow-300 cursor-pointer px-4 py-1 rounded-full'>Update</button>}
                </div>
            </div>

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

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-200/50">
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
            </div>

        </div></>)
}

export default OrderDetails