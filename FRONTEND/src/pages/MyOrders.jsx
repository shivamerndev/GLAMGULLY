import { useContext, useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, Calendar, MapPin, Star, ChevronRight, Eye, RotateCcw } from 'lucide-react';
import { CustomerDataContext } from '../context/CustomerContext';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from './Payment';

const MyOrders = () => {
  const { getOrderHistory, createReOrder } = useContext(CustomerDataContext);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    getOrderHistory().then(res => {
      setOrders(res);
      setLoading(false);
    }).catch(err => {
     console.error( err.response ? err.response.data.message : err )
    });
  }, []);

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
        return <RotateCcw className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded-lg w-48 mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
                <div className="h-6 bg-amber-100 rounded w-32 mb-4"></div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-amber-100 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-amber-100 rounded w-3/4"></div>
                    <div className="h-4 bg-amber-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/50">
      <div className="max-w-6xl mx-auto md:px-4 px-2  py-3">
        {/* Header */}
        <div className="mb-4">
          <h1 className="md:text-xl text-lg font-bold text-amber-900 flex items-center gap-2">
            <Package className="w-6 md:w-7 h-6 md:h-7 text-amber-700" />
            My Orders
          </h1>
          <p className="text-amber-700 font-medium text-sm md:text-base">
            Track and manage all your orders.
          </p>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-amber-200/50">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900 mb-3">No Orders Yet</h2>
            <p className="text-amber-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <button onClick={() => navigate("/product/all")} className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-2xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-105">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-2 md:px-6 px-2 border-b border-amber-300">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-amber-900 whitespace-nowrap">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`px-3 py-0.5 rounded-full text-sm font-semibold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-amber-700">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="w-4 h-4" />
                          Ordered: {formatDate(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <MapPin className="w-4 h-4" />
                          Address ID: {order.shippingAddress.slice(-10)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-amber-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-amber-600 font-medium">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className=" flex flex-wrap gap-3 justify-between items-center py-2 px-4 border-t border-amber-100">
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/track/orders/${order._id}`)} className="px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all transform hover:scale-105 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Track Order
                    </button>
                    {order.status === 'delivered' && (
                      <button onClick={() => {
                        const func = async () => {
                          setLoading(true)
                          await createReOrder(order._id);
                          getOrderHistory().then(res => {
                            setOrders(res);
                            setLoading(false);
                          });
                        }
                        handlePayment(order.totalAmount, func)
                      }} className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Reorder
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-amber-600">
                    Last updated: {formatDate(order.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
