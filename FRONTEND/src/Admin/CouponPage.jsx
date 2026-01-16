import React, { useContext, useEffect, useState } from 'react';
import {
    Percent,
    Calendar,
    Users,
    Tag,
    Plus,
    Edit,
    Trash2,
    Copy,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Eye,
    EyeOff,
    LucideActivitySquare
} from 'lucide-react';
import Confirm from '../utils/Confirm';
import { AdminDataContext } from '../context/AdminContext';

const CouponPage = () => {
    const { CreateCouponCode, getCouponCode, deleteCouponCode, editCouponCode } = useContext(AdminDataContext)
    const [coupons, setCoupons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [deleteCoupon, setdeleteCoupon] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        type: 'percentage',
        expirationDate: '',
        usageLimit: '',
        applicableCategories: 'all',
        minOrderValue: '',
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const [copiedCode, setCopiedCode] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        getCouponCode().then(res => setCoupons(res))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            setEditingId(null);
            editCouponCode(formData).then(res => getCouponCode().then(res => setCoupons(res)))
        } else {
            CreateCouponCode(formData).then(res => getCouponCode().then(res => setCoupons(res)))
        }
        setFormData({
            code: '',
            discountPercentage: '',
            type: 'percentage',
            expirationDate: '',
            usageLimit: '',
            applicableCategories: '',
            minOrderValue: '',
            isActive: true
        });
        setShowForm(false);
    };

    const handleEdit = (coupon) => {
        setShowForm(true);
        setFormData({ ...coupon, expirationDate: coupon.expirationDate.split('T')[0] });
        setEditingId(coupon.code);
    };

    const toggleActive = (data) => {
        const obj = ({ ...data, isActive: !data.isActive });
        editCouponCode(obj).then(res => getCouponCode().then(res => setCoupons(res)))
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    const isExpired = (date) => {
        return new Date(date) < new Date();
    };

    const getUsagePercentage = (used, limit) => {
        return ((used / limit) * 100).toFixed(0);
    };

    const stats = {
        total: coupons.length,
        active: coupons.filter(c => c.isActive && !isExpired(c.expirationDate)).length,
        expired: coupons.filter(c => isExpired(c.expirationDate)).length,
        totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0)
    };

    const getClick = (btn) => {
        if (btn === 'confirm') {
            setdeleteCoupon(false);
            deleteCouponCode(deleteCoupon._id).then(res => {
                getCouponCode().then(res => setCoupons(res))
            })
        } else {
            setdeleteCoupon(false);
        }
    }

    return (coupons &&
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
            {deleteCoupon && <Confirm type='delete' getClick={getClick} />}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className='flex justify-between items-center mb-6'>
                    <h1 className="text-2xl font-bold text-amber-900  flex items-center gap-3">
                        <Tag className="w-6 h-6 text-amber-700" />
                        Coupon Management
                    </h1>
                    <button onClick={() => setShowForm(true)} className="text-base  font-semibold cursor-pointer text-amber-50 rounded-lg px-4 py-1.5 bg-amber-800"> <Plus className="w-5 h-5 text-amber-50 inline" /> Create New</button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-amber-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 font-medium text-sm">Total Coupons</span>
                            <Tag className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-3xl font-bold text-amber-900">{stats.total}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-green-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700 font-medium text-sm">Active</span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-900">{stats.active}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-red-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-red-700 font-medium text-sm">Expired</span>
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-900">{stats.expired}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 border border-purple-200/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-700 font-medium text-sm">Total Usage</span>
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-purple-900">{stats.totalUsage}</p>
                    </div>
                </div>

                {/* Create/Edit Form */}
                {showForm && <div className=' w-full  h-screen left-0 top-0 z-50 flex justify-center items-center  fixed bg-black/50'>
                    <div className="bg-white relative  rounded-2xl shadow-2xl shadow-black/80 md:p-8 p-6 mb-8 border border-amber-200/50">
                        <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                            {editingId ? 'Edit Coupon' : 'Create New Coupon'}
                        </h2>
                        <h1 onClick={() => setShowForm(false)} className='text-3xl cursor-pointer text-red-500 absolute right-6 top-6'>&times;</h1>

                        <form onSubmit={handleSubmit} className="md:space-y-6">
                            <div className="grid md:grid-cols-2 md:gap-6 gap-4">
                                {/* Coupon Code */}
                                <div>
                                    <label className="block text-amber-900 font-semibold mb-2">
                                        Coupon Code *
                                    </label>
                                    <input required
                                        minLength={4}
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g., SAVE20"

                                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent uppercase"
                                    />
                                </div>

                                {/* Discount Type */}
                                <div>
                                    <label className="block text-amber-900 font-semibold mb-2">
                                        Discount Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option disabled value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>

                                {/* Discount Value */}
                                <div>
                                    <label className="block text-amber-900 font-semibold mb-2">
                                        Discount Value *
                                    </label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                        <input required
                                            type="number"
                                            name="discountPercentage"
                                            value={formData.discountPercentage}
                                            onChange={handleInputChange}
                                            placeholder={formData.type === 'percentage' ? '20' : '500'}

                                            className="w-full border-2 border-amber-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Min Order Value */}
                                <div>
                                    <label className="block text-amber-900 font-semibold mb-2">
                                        Minimum Order Value (₹)
                                    </label>
                                    <input required
                                        type="number"
                                        name="minOrderValue"
                                        value={formData.minOrderValue}
                                        onChange={handleInputChange}
                                        placeholder="500"
                                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                    />
                                </div>

                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-amber-900 font-semibold mb-2">
                                        Expiry Date *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                        <input required
                                            type="date"
                                            name="expirationDate"
                                            value={formData.expirationDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full border-2 border-amber-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Usage Limit */}
                                <div>
                                    <label className="block text-amber-900 font-semibold mb-2">
                                        Usage Limit *
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                                        <input required
                                            type="number"
                                            name="usageLimit"
                                            value={formData.usageLimit}
                                            onChange={handleInputChange}
                                            placeholder="100"

                                            className="w-full border-2 border-amber-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*Categories */}
                            <div>
                                <label className="block text-amber-900 font-semibold mb-2">
                                    Applicable Categories
                                </label>
                                <input required
                                    type="text"
                                    name="applicableCategories"
                                    value={formData.applicableCategories}
                                    onChange={handleInputChange}
                                    placeholder="electronics, fashion, footwear (or 'all' for all Categories)"
                                    className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                                />
                                <p className="text-sm text-amber-600 mt-2">Separate multiple categories with commas</p>
                            </div>

                            <button
                                type="submit"
                                className=" bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 px-4 rounded-md font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                                <Plus className="w-5 h-5" />
                                {editingId ? 'Update Coupon' : 'Create Coupon'}
                            </button>
                        </form>
                    </div>
                </div>}

                {/* Coupons List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-amber-900"> <LucideActivitySquare className='inline mx-3' /> Active Coupons</h2>
                    {coupons.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-amber-200/50">
                            <Tag className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-amber-900 mb-2">No Coupons Yet</h3>
                            <p className="text-amber-600">Create your first coupon to get started!</p>
                        </div>
                    ) : (
                        coupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 hover:shadow-2xl transition-all ${isExpired(coupon.expirationDate)
                                    ? 'border-red-300 opacity-75'
                                    : coupon.isActive
                                        ? 'border-green-300'
                                        : 'border-gray-300 opacity-75'
                                    }`}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        {/* Left Section */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl px-4 py-1.5">
                                                    <span className="text-base font-bold text-white uppercase">{coupon.code}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(coupon.code)}
                                                        className="p-2 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
                                                        title="Copy code">
                                                        {copiedCode === coupon.code ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-amber-600" />
                                                        )}
                                                    </button>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isExpired(coupon.expirationDate)
                                                        ? 'bg-red-100 text-red-800'
                                                        : coupon.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {isExpired(coupon.expirationDate) ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div className="bg-purple-50 rounded-xl p-3">
                                                    <p className="text-sm text-purple-700 mb-1">Discount</p>
                                                    <p className="text-xl font-bold text-purple-900">
                                                        {coupon.type !== 'percentage' ? `${coupon.discountPercentage}%` : `₹${coupon.discount}`}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 rounded-xl p-3">
                                                    <p className="text-sm text-blue-700 mb-1">Min Order</p>
                                                    <p className="text-xl font-bold text-blue-900">₹{coupon.minOrderValue}</p>
                                                </div>
                                                <div className="bg-green-50 rounded-xl p-3">
                                                    <p className="text-sm text-green-700 mb-1">Valid Until</p>
                                                    <p className="text-lg font-bold text-green-900">
                                                        {new Date(coupon.expirationDate).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="bg-amber-50 rounded-xl p-3">
                                                    <p className="text-sm text-amber-700 mb-1">Usage</p>
                                                    <p className="text-xl font-bold text-amber-900">
                                                        {coupon.usedCount}/{coupon.usageLimit}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Usage Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                    <span>Usage Progress</span>
                                                    <span className="font-semibold">{getUsagePercentage(coupon.usedCount, coupon.usageLimit)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${getUsagePercentage(coupon.usedCount, coupon.usageLimit) > 80
                                                            ? 'bg-red-500'
                                                            : getUsagePercentage(coupon.usedCount, coupon.usageLimit) > 50
                                                                ? 'bg-amber-500'
                                                                : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${getUsagePercentage(coupon.usedCount, coupon.usageLimit)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-2">
                                                {coupon.applicableCategories.map((cat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 ml-4">
                                            <button
                                                onClick={() => toggleActive(coupon)}
                                                className={`p-3 rounded-xl transition-colors ${coupon.isActive
                                                    ? 'bg-green-100 hover:bg-green-200 text-green-700'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                                title={coupon.isActive ? 'Deactivate' : 'Activate'}>
                                                {coupon.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(coupon)}
                                                className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors"
                                                title="Edit">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setdeleteCoupon(coupon)}
                                                className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponPage;