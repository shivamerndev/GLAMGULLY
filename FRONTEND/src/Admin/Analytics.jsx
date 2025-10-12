import React, { useState, useEffect, useContext } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    Calendar,
    Download,
    Filter,
    Eye,
    BarChart3,
    PieChart as PieChartIcon,
    Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AdminDataContext } from "../context/AdminContext"

const Analytics = () => {
    const { AdminAnalytics } = useContext(AdminDataContext)
    const [timeRange, setTimeRange] = useState('7days');
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState(null)
    const [toggleOrders, setToggleOrders] = useState(false)
    const getData = async () => {
        let res = await AdminAnalytics()
        console.log(res)
        setTrendData(res)
        setLoading(false)
    }
    useEffect(() => {
        getData()
    }, []);
    // Monthly Comparison Data
    const monthlyComparisonData = [
        { month: 'Jun', revenue: 2450, orders: 4, avgOrder: 2 },
        { month: 'Jul', revenue: 2890, orders: 5, avgOrder: 3 },
        { month: 'Aug', revenue: 3120, orders: 2, avgOrder: 5 },
        { month: 'Sep', revenue: 3980, orders: 6, avgOrder: 7 }
    ];

    // Top Products Performance
    const topProductsData = [
        { product: 'Leather Sneakers', units: 3, revenue: 2510 },
        { product: 'Wireless Headphones', units: 5, revenue: 2310 },
        { product: 'Cotton T-Shirt', units: 9, revenue: 2210 },
        { product: 'Smart Watch', units: 6, revenue: 1310 },
        { product: 'Denim Jacket', units: 10, revenue: 910 }
    ];

    const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-12 bg-amber-200 rounded-2xl w-54"></div>
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

    return (trendData &&
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-amber-900  flex items-center gap-3">
                            <BarChart3 className="w-7 h-7 text-amber-700" />
                            Analytics Dashboard
                        </h1>
                        <p className="text-amber-700 font-medium">Comprehensive insights into your business performance</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white border-2 border-amber-200 rounded-xl px-4 py-2 focus:outline-none focus:border-amber-400 text-amber-900 font-medium"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                            <option value="year">This Year</option>
                        </select>
                        <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg">
                            <Download className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Sales Trend Chart */}
                <div className="bg-white rounded-3xl shadow-xl md:px-8 pl-2  py-6 mb-6 border border-amber-200/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-amber-600" />
                            Sales Trend Analysis
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={() => { setToggleOrders(false) }} className={`px-4 py-1.5 ${toggleOrders ? " bg-gray-100 text-gray-700 hover:bg-gray-200" : " bg-amber-100 text-amber-800  "} font-medium rounded-xl hover:bg-amber-200 transition-colors`}>
                                Revenue
                            </button>
                            <button onClick={() => { setToggleOrders(true) }} className={`px-4 py-1.5 ${!toggleOrders ? " bg-gray-100 text-gray-700 hover:bg-gray-200" : " bg-amber-100 text-amber-800  "} rounded-xl font-medium hover:bg-gray-200 transition-colors`}>
                                Orders
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer border='0px' width="100%" height={400}>
                        <AreaChart data={trendData.dailyOrders}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis allowDecimals={false} stroke="#6b7280" />
                            <Tooltip contentStyle={{
                                backgroundColor: '#fff',
                                border: '2px solid #f59e0b',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey={toggleOrders ? "orders" : "revenue"}
                                stroke="#f59e0b"
                                fillOpacity={1}
                                fill="url(#colorSales)"
                                strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Category-wise Sales */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-amber-200/50">
                        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-amber-600" />
                            Category-wise Sales
                        </h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={trendData.categorySales}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name} ${percentage}% `}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value">
                                    {trendData.categorySales.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '3px solid #f59e0b',
                                        borderRadius: '12px'
                                    }}
                                    formatter={(value) => `₹${value.toLocaleString()}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-6 space-y-3">
                            {trendData.categorySales.map((category, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        ></div>
                                        <span className="font-semibold text-amber-900">{category.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-amber-900">₹{category.value.toLocaleString()}</p>
                                        <p className="text-xs text-amber-600">{category.orders} orders</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white rounded-3xl shadow-xl py-8 border border-amber-200/50">
                        <h2 className="text-xl px-8 font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-amber-600" />
                            Orders by Status
                        </h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={trendData.statusSummary}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="status" fontSize="11px" stroke="#6b7280" tickFormatter={(value) => value.slice(0, 12)} interval={0} />

                                <YAxis allowDecimals={false} stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '2px solid #f59e0b',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {trendData.statusSummary.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-6 px-8 grid grid-cols-2 gap-4">
                            {trendData.statusSummary.map((status, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: status.color }}
                                        ></div>
                                        <span className="text-sm text-gray-600">{status.status}</span>
                                    </div>
                                    <p className="text-2xl font-bold" style={{ color: status.color }}>
                                        {status.count}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Products Performance */}
                <div className="bg-white rounded-3xl shadow-xl mb-8 p-8 border border-amber-200/50">
                    <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-amber-600" />
                        Top Products Performance
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-amber-200">
                                    <th className="text-left py-4 px-4 text-amber-900 font-semibold">Product</th>
                                    <th className="text-right py-4 px-4 text-amber-900 font-semibold">Units Sold</th>
                                    <th className="text-right py-4 px-4 text-amber-900 font-semibold">Revenue</th>
                                    <th className="text-right py-4 px-4 text-amber-900 font-semibold">Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trendData.topProducts.map((product, index) => (
                                    <tr key={index} className="border-b border-amber-100 hover:bg-amber-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center text-white font-bold">
                                                    #{index + 1}
                                                </div>
                                                <span className="font-semibold text-amber-900">{product.product}</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-4 pr-8 font-semibold text-amber-900">{product.units >= 10 ? product.units : "0" + product.units}</td>
                                        <td className="text-right py-4 px-4 font-bold text-green-700">₹{product.revenue.toLocaleString()}</td>
                                        <td className="text-right py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                                                        style={{ width: `${(product.units / 25) * 100}%` }}></div>
                                                </div>
                                                <span className="text-sm font-semibold text-amber-700">
                                                    {Math.round((product.units / 25) * 100)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Comparison */}
                <div className="bg-white rounded-3xl shadow-xl p-8  border border-amber-200/50">
                    <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        Monthly Performance Comparison.(Isko future me banana hai)
                    </h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '2px solid #f59e0b',
                                    borderRadius: '12px'
                                }}
                                formatter={(value) => value.toLocaleString()}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default Analytics;