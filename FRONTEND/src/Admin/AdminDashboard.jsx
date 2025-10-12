import React, { useContext, useState, useEffect } from 'react';
import {
    IndianRupeeIcon,
    ShoppingCart,
    Users,
    Package,
    Activity,
    Eye,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    MonitorIcon
} from 'lucide-react';
import { AdminDataContext } from '../context/AdminContext';
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
    const { AdminDashboardStats } = useContext(AdminDataContext)
    const [loading, setLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);
    const navigate = useNavigate()

    const getData = () => {
        AdminDashboardStats().then(res => {
            setDashboardStats(res)
            setLoading(false)
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        getData()
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-amber-100 text-amber-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const StatCard = ({ title, value, change, icon: Icon, color }) => (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200/50 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(change)}%
                </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-12 bg-amber-200 rounded-2xl w-64"></div>
                        <div className="grid grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-40 bg-white rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="h-96 bg-white rounded-2xl"></div>
                            <div className="h-96 bg-white rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    const formatDate = (createdAt) => {
        return new Date(createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (dashboardStats &&
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>

                        <h1 className="text-2xl flex items-center gap-3 font-bold text-amber-900"><MonitorIcon /> Dashboard Overview</h1>
                        <p className="text-amber-700 font-medium">Welcome back! Here's what's happening with your store.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => { setLoading(true); getData() }} className="bg-white border-2 border-amber-200 hover:bg-amber-50 text-amber-700 p-2 rounded-xl transition-colors">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${dashboardStats.totals.revenue.toLocaleString()}`}
                        change={dashboardStats.totals.revenue}
                        icon={IndianRupeeIcon}
                        color="bg-gradient-to-br from-green-500 to-emerald-600" />
                    <StatCard
                        title="Total Orders"
                        value={dashboardStats.totals.orders.toLocaleString()}
                        change={dashboardStats.totals.orders}
                        icon={ShoppingCart}
                        color="bg-gradient-to-br from-blue-500 to-cyan-600" />
                    <StatCard
                        title="Total Customers"
                        value={dashboardStats.totals.customers.toLocaleString()}
                        change={dashboardStats.totals.customers}
                        icon={Users}
                        color="bg-gradient-to-br from-purple-500 to-pink-600" />
                    <StatCard
                        title="Total Products"
                        value={dashboardStats.totals.products.toLocaleString()}
                        change={dashboardStats.totals.products}
                        icon={Package}
                        color="bg-gradient-to-br from-amber-500 to-orange-600" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-amber-600" />
                                Recent Orders
                            </h2>
                            <button onClick={() => navigate(`/admin/glamgully/orders`)} className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1">
                                View All
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dashboardStats.recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl hover:bg-amber-50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-amber-900">Order #{order._id.slice(15)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-amber-700">{order.customer.fullname}</p>
                                        <p className="text-xs text-amber-600 mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-amber-900">₹{order.totalAmount.toLocaleString()}</p>
                                        <button onClick={() => navigate(`/admin/glamgully/orders/${order._id}`)} className="text-amber-600 hover:text-amber-700 text-sm mt-1">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        {/* Order Status */}
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-200/50">
                            <h3 className="text-xl font-bold text-amber-900 mb-4">Order Status</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Pending', count: 0, color: 'amber', icon: Clock },
                                    { label: 'Processing', count: 0, color: 'purple', icon: Package },
                                    { label: 'Shipped', count: 0, color: 'blue', icon: CheckCircle },
                                    { label: 'Delivered', count: 0, color: 'green', icon: CheckCircle },
                                    { label: 'Cancelled', count: 0, color: 'red', icon: XCircle }
                                ].map((status) => {
                                    const Icon = status.icon;
                                    return (
                                        <div key={status.label} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg bg-${status.color}-100 flex items-center justify-center`}>
                                                    <Icon className={`w-4 h-4 text-${status.color}-600`} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{status.label}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{dashboardStats.orderStatus.find(s => s._id == status.label.toLowerCase())?.count || status.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Revenue Chart Placeholder */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-2">This Week's Revenue</h3>
                            <p className="text-4xl font-bold mb-1">₹{dashboardStats.thisWeekRevenue}</p>
                            <p className="text-sm opacity-90 mb-4">+23% from last week</p>
                            <div className="flex items-end gap-1 h-24">
                                {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                                    <div key={i} className="flex-1 bg-white/30 rounded-t-lg hover:bg-white/40 transition-colors" style={{ height: `${height}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Top Products */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                                <Star className="w-6 h-6 text-amber-600" />
                                Top Products
                            </h2>
                            <button onClick={() => navigate(`/admin/glamgully/products`)} className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dashboardStats.topProducts.map((product, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-xl hover:bg-amber-50 transition-colors">
                                    <img src={product.product.productimage[0]} alt={product.product.title} className="w-16 h-16 rounded-xl object-cover border-2 border-amber-200" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-amber-900 truncate">{product.product.title}</h4>
                                        <p className="text-sm text-amber-700">{product.totalSold} sales</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-amber-900">₹{(product.product.price * product.totalSold).toLocaleString()}</p>
                                        {/* <span className={`inline-flex items-center gap-1 text-xs font-semibold ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {product.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {product.trend === 'up' ? 'Up' : 'Down'}
                                        </span> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Customers */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                                <Users className="w-6 h-6 text-amber-600" />
                                Recent Customers
                            </h2>
                            <button onClick={() => navigate(`/admin/glamgully/customers`)} className="text-amber-600 hover:text-amber-700 font-semibold text-sm">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dashboardStats.recentCustomers.map((customer, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-xl hover:bg-amber-50 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold">
                                        {customer.fullname.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-amber-900">{customer.fullname}</h4>
                                        <p className="text-sm text-amber-700">{customer.email}</p>
                                        <p className="text-xs text-amber-600">{customer.ordersHistory.length} orders • ₹{customer.totalSpend.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-amber-600">{new Date(customer.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;