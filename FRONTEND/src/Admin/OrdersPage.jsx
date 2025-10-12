import { useEffect, useState, useContext } from 'react';
import { AdminDataContext } from '../context/AdminContext'
import {
    Search,
    Filter,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    Calendar,
    IndianRupeeIcon,
    Edit,
    User,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ListOrderedIcon,
    RefreshCw,
    Star
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';


const OrdersPage = () => {
    const navigate = useNavigate()
    const { readOrders, viewCustomerOrders } = useContext(AdminDataContext)
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;
    const userId = new URLSearchParams(location.search).get('user')

    useEffect(() => {
        if (userId) {
            viewCustomerOrders(userId).then(res => { setOrders(res.ordersHistory); setLoading(false) }).catch(err => console.log(err.response.data))
            return
        }
        readOrders().then(res => {
            setOrders(res.total)
            setLoading(false)
        }).catch(err => {
            console.log(err);
        })
    }, [userId])

    useEffect(() => {
        let filtered = orders;

        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item =>
                    item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order =>
                order.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, orders]);

    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'processing':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800 border-indigo-300';
            case 'out for delivery':
                return 'bg-cyan-100 text-cyan-800 border-cyan-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'confirmed':
            case 'processing':
                return <Package className="w-4 h-4" />;
            case 'shipped':
            case 'out for delivery':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status.toLowerCase() === 'pending').length,
        delivered: orders.filter(o => o.status.toLowerCase() === 'delivered').length,
        cancelled: orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
        revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-12 bg-amber-200 rounded-2xl w-64"></div>
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-white rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="h-96 bg-white rounded-2xl"></div>
                    </div>
                </div>
            </div>
        );
    }
    // console.log(orders)

    return (
        <div className="min-h-screen bg-amber-50/50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-amber-900 mb- flex items-center gap-3">
                        <ListOrderedIcon className="w-7 h-7 text-amber-700" />
                        Orders Management
                    </h1>
                    <p className="text-amber-700 font-medium">Manage and track all customer orders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 font-medium text-sm">Total Orders</span>
                            <Package className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-bold text-amber-900">{orderStats.total}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 font-medium text-sm">Pending</span>
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-bold text-amber-900">{orderStats.pending}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700 font-medium text-sm">Delivered</span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-900">{orderStats.delivered}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-red-700 font-medium text-sm">Cancelled</span>
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-900">{orderStats.cancelled}</p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">Total Revenue</span>
                            <IndianRupeeIcon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold">₹ {orderStats.revenue.toLocaleString()}.00</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-3 mb-6 border border-amber-200/50">
                    <div className="flex flex-wrap items-center justify-around gap-4">
                        {/* Search */}
                        <div className="relative flex-1/2 w-1/3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by Order Id or Customer Id"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-white border-2 border-amber-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-amber-400 text-amber-900 font-medium">
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="out for delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600 pointer-events-none" />
                        </div>

                        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            More Filters
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-700 py-2 px-4 rounded-xl transition-colors">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {currentOrders.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-amber-200/50">
                            <Package className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-amber-900 mb-2">No Orders Found</h3>
                            <p className="text-amber-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        currentOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200/90 hover:shadow-2xl transition-all">
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 border-b border-amber-200/50">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-bold text-amber-900">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-700">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(order.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    Customer: {order.customer.slice(-6)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-amber-900 mb-1">
                                                <h1 className="text-base font-semibold">Total Amount</h1>
                                                ₹{order.totalAmount.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <button onClick={() => navigate(`${order._id}`)} className="bg-gradient-to-r my-2 mx-6 from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit Order
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-5 h-5 text-amber-700" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === index + 1
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'hover:bg-amber-100 text-amber-700'
                                    }`}>
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronRight className="w-5 h-5 text-amber-700" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default OrdersPage
