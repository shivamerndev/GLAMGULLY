import React, { useContext, useEffect, useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    BellRingIcon,
} from 'lucide-react';
import { ProductDataContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
    const { getProductsAdmin, editProduct, deleteProduct, categoryProduct, categoryPublic, archiveCategory, activeCategory } = useContext(ProductDataContext)
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [priceFilter, setPriceFilter] = useState('$50 - $500');
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProductsAdmin().then((data) => {
            setProducts(data);
        })
    }, [])
    
    return (<div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-800">Products</h1>
                    <span className="bg-amber-100 text-amber-800 px-3 py-0.5 rounded-full text-sm font-semibold">
                        {products.length} items
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-full p-1.5 flex items-center justify-center">
                        <BellRingIcon className='text-amber-600' />{">10"}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                        <img src="/default.png" alt="admin" />
                    </div>
                </div>
            </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-1.5 pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Footwear</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-1.5 pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Draft</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* Price Filter */}
                    <div className="relative">
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-1.5 pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option>$50 - $500</option>
                            <option>$0 - $50</option>
                            <option>$500 - $1000</option>
                            <option>$1000+</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <button onClick={() => navigate(`/admin/glamgully/product/addnew`)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-1.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Product Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Price</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Stocks</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                        <th className="text-left px-4 whitespace-nowrap py-3 font-semibold text-gray-700">Action Buttons</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors">
                            <td className="px-4 py-3 ">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.productimage[0]}
                                        alt={product.title}
                                        className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                                    <div>
                                        <p className="font-semibold text-gray-800 leading-none">{product.title}</p>
                                        <p className="text-sm text-gray-500">{product.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <span className="font-semibold text-gray-800">{product.price}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-gray-700">{product.quantity}</span>
                            </td>
                            <td className="px-4 py-3">
                                <span onClick={async () => {
                                    await editProduct({ ...product, isActive: !product.isActive }).catch(err => console.log(err.response.data))
                                    getProductsAdmin().then((data) => {
                                        setProducts(data);
                                    })
                                }}
                                    className={`${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} md:cursor-pointer capitalize  px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit`}>
                                    <div className={`w-2 h-2 rounded-full ${product.isActive ? "bg-green-500 " : "bg-red-500 "}`}></div>
                                    {product.isActive ? "active" : "Inactive"}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2 pl-4 ">
                                    <button onClick={() => navigate(`/admin/glamgully/product/${product._id}`, { state: product })} className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all">
                                        <Edit className="w-4 h-4 text-amber-100" />
                                    </button>
                                    <button onClick={() => {
                                        deleteProduct(product._id)
                                        getProductsAdmin().then((data) => {
                                            setProducts(data);
                                        })
                                    }} className="cursor-pointer p-2 bg-red-500 rounded-full px-3 py-1.5 flex items-center gap-1 text-amber-50 font-semibold transition-colors">
                                        <Trash2 className="w-4 h-4 text-amber-100" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3, 4, 5, 6].map((page) => (
                    <button
                        key={page}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${page === currentPage
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}
                <span className="text-gray-400 mx-2">...</span>
                <button className="w-10 h-10 rounded-xl font-medium hover:bg-gray-100 text-gray-700 transition-colors">
                    24
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
    )
}

export default ProductsPage