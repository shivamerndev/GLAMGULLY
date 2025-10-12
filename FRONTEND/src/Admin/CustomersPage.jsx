import { useContext, useEffect, useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Users,
    Mail,
    Phone,
    MapPin,
    ShoppingCart,
    Heart,
    Package,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    TrendingUp,
    Award,
    Activity,
    Home
} from 'lucide-react';
import { AdminDataContext } from '../context/AdminContext';
import { CustomerDataContext } from '../context/CustomerContext';
import { useNavigate } from 'react-router-dom';

const CustomersPage = () => {
    const { allCustomers } = useContext(AdminDataContext)
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const itemsPerPage = 5;

    useEffect(() => {
        allCustomers().then(res => { setCustomers(res.total); setLoading(false) }).catch(err => console.log(err.response.data))
    }, []);



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };


    const getGenderColor = (gender) => {
        return gender.toLowerCase() === 'male'
            ? 'bg-blue-100 text-blue-800 border-blue-300'
            : 'bg-pink-100 text-pink-800 border-pink-300';
    };


    // const customers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const customerStats = {
        total: customers.length,
        male: customers.filter(c => c.gender.toLowerCase() === 'male').length,
        female: customers.filter(c => c.gender.toLowerCase() === 'female').length,
        activeCustomers: customers.filter(c => c.ordersHistory.length > 0).length,
        totalOrders: customers.reduce((sum, c) => sum + c.ordersHistory.length, 0),
        avgOrdersPerCustomer: customers.length > 0
            ? (customers.reduce((sum, c) => sum + c.ordersHistory.length, 0) / customers.length).toFixed(1)
            : 0
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-amber-900 flex items-center gap-3">
                        <Users className="w-7 h-7 text-amber-700" />
                        Customer Management
                    </h1>
                    <p className="text-amber-700 font-medium">Manage and track all your customers</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 font-medium text-sm">Total Customers</span>
                            <Users className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-3xl font-bold text-amber-900">{customerStats.total}</p>
                        <div className="mt-3 flex gap-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-semibold">
                                {customerStats.male} Male
                            </span>
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-lg text-xs font-semibold">
                                {customerStats.female} Female
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700 font-medium text-sm">Active Customers</span>
                            <Activity className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-900">{customerStats.activeCustomers}</p>
                        <p className="text-sm text-green-600 mt-2">
                            {((customerStats.activeCustomers / customerStats.total) * 100).toFixed(1)}% of total
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-700 font-medium text-sm">Total Orders</span>
                            <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-purple-900">{customerStats.totalOrders}</p>
                        <p className="text-sm text-purple-600 mt-2">
                            Avg: {customerStats.avgOrdersPerCustomer} per customer
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">New This Month</span>
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <p className="text-3xl font-bold">{customers.filter(c => {
                            const createdDate = new Date(c.createdAt);
                            const now = new Date();
                            return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                        }).length}</p>
                        <p className="text-sm mt-2 opacity-90">Recently joined</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-xl px-4 py-2 mb-6 border border-amber-200/50">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by CustomerId, email or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900" />
                        </div>

                        {/* Gender Filter */}
                        <div className="relative">
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="appearance-none bg-white border-2 border-amber-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-amber-400 text-amber-900 font-medium">
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600 pointer-events-none" />
                        </div>

                        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            More Filters
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl transition-colors">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Customers List */}
                <div className="space-y-6">
                    {customers.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-amber-200/50">
                            <Users className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-amber-900 mb-2">No Customers Found</h3>
                            <p className="text-amber-600">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        customers.map((customer) => (
                            <div key={customer._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-200/50 hover:shadow-2xl transition-all">
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-base font-bold shadow-lg">
                                                <img className='w-full h-full object-cover' src={customer.gender === "male" ? "/male.jpg" : customer.gender === "other" ? "/default.png" : "/female.jpg"} alt="avatar" />
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl capitalize font-bold text-amber-900 mb-2">
                                                        {customer.fullname}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGenderColor(customer.gender)}`}>
                                                            {customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)}
                                                        </span>
                                                        {customer.ordersHistory.length > 0 && (
                                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold border border-green-300 flex items-center gap-1">
                                                                <Award className="w-3 h-3" />
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-3 text-sm text-amber-700">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-amber-600" />
                                                            <a href={`mailto:${customer.email}`} className="hover:text-amber-900 font-medium">
                                                                {customer.email}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-amber-600" />
                                                            <a href={`tel:${customer.phone}`} className="hover:text-amber-900 font-medium">
                                                                {customer.phone}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-amber-600" />
                                                            <span>Joined: {formatDate(customer.createdAt)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-amber-600" />
                                                            <span>{customer.address.length} Address{customer.address.length !== 1 ? 'es' : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-3 rounded-xl transition-colors">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-3 rounded-xl transition-colors">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-xl transition-colors">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Customer Stats */}
                                            <div className="grid grid-cols-4 gap-4 mt-4 pt-6 border-t border-amber-100">
                                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
                                                    <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                                    <p className="text-2xl font-bold text-purple-900">{customer.ordersHistory.length}</p>
                                                    <p className="text-sm text-purple-700 font-medium">Orders</p>
                                                </div>
                                                <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 text-center border border-pink-200">
                                                    <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                                                    <p className="text-2xl font-bold text-pink-900">{customer.wishlist.length}</p>
                                                    <p className="text-sm text-pink-700 font-medium">Wishlist</p>
                                                </div>
                                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
                                                    <ShoppingCart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                                    <p className="text-2xl font-bold text-blue-900">{customer.cart.length}</p>
                                                    <p className="text-sm text-blue-700 font-medium">Cart Items</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-red-50 via-rose-100/90 to-red-100 rounded-2xl p-4 text-center border border-red-200">
                                                    <Home className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                                    <p className="text-2xl font-bold text-red-900">{customer.address.length}</p>
                                                    <p className="text-sm text-red-700 font-medium">Addresses</p>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex gap-3 mt-4">
                                                <button onClick={() => navigate(`/admin/glamgully/orders?user=${customer._id}`)} className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                                                    <Package className="w-4 h-4" />
                                                    View Orders
                                                </button>
                                                <button onClick={() => {
                                                    window.location.href = `sms:+91${customer.phone}?body=Hello ${customer.fullname}, we're reaching out from GlamGully. It looks like you still have some products in your cart. Aage ka khud likh lena thik hai 😂. `
                                                }} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Send Message
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 text-amber-700" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === index + 1
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'hover:bg-amber-100 text-amber-700'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-amber-700" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomersPage;