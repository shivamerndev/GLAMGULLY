import { useContext, useEffect, useState } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRef } from 'react';

const ProductsPage = () => {
    const timeoutRef = useRef(null);
    const searchRef = useRef(null);
    const { getProductsAdmin, editProduct, deleteProduct, searchProductForAdmin } = useContext(ProductDataContext)
    const [searchParam, setSearchParam] = useSearchParams()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [statusFilter, setStatusFilter] = useState(searchParam.get('status') || 'All Status');
    const [priceFilter, setPriceFilter] = useState(searchParam.get('price'));
    const [availability, setAvailability] = useState(searchParam.get('availability'));
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [lowStocks, setLowStocks] = useState(0)
    const [clicked, setClicked] = useState(false);
    const [searchClicked, setsearchClicked] = useState(false);
    let filters = searchParam.toString();

    useEffect(() => {
        getProductsAdmin(currentPage, filters).then((data) => {
            setProducts(data.products);
            setCategories(data.categories);
            setTotalProducts(data.totalProducts);
            setTotalPages(data.totalPages);
            setLowStocks(data.lowStocks);
        })
    }, [currentPage, searchParam])

    const updateSearchParam = (key, value) => {
        const newParams = new URLSearchParams(searchParam);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParam(newParams, { replace: true });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== '') {
                searchProductForAdmin(searchTerm).then(res => {
                    setProducts(res)
                })
            } else {
                getProductsAdmin(currentPage, filters).then((data) => {
                    setProducts(data.products);
                    setCategories(data.categories);
                    setTotalProducts(data.totalProducts);
                    setTotalPages(data.totalPages);
                    setLowStocks(data.lowStocks);
                })
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm])

    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setsearchClicked(false);
        }
    };
    useEffect(() => {
        if (searchClicked) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchClicked]);

    return (products && <div className="flex-1 flex flex-col select-none">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 md:px-6 px-3 py-3">
            <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-800">Products</h1>
                    <span className="bg-amber-100 text-amber-800 px-3 py-0.5 rounded-full text-sm font-semibold">
                        {totalProducts} items
                    </span>
                </div>
                {/* Search */}
                {searchClicked && <div ref={searchRef} className="absolute z-50 top-1 left-0 md:left-1/3 md:top-0 bg-white md:w-1/2 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200" />
                </div>}
                <div className='flex items-center gap-1 md:gap-3'>
                    {!searchClicked && <Search onClick={() => setsearchClicked(true)} className=" text-amber-500" />}
                    <div onClick={() => {
                        clearTimeout(timeoutRef.current); // old timer cancel
                        setClicked(!clicked);
                        timeoutRef.current = setTimeout(() => {
                            setClicked(false);
                        }, 5000);
                    }}
                        className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center relative cursor-pointer">
                        {lowStocks && !clicked && <h1 className='bg-red-500 text-white rounded-full px-1 text-xs text-center font-semibold absolute right-1 top-1 w-3 h-3 '></h1>}
                        {clicked && <p className=" w-[90vw] md:whitespace-nowrap md:w-fit absolute z-50 right-2 top-11 bg-red-100 rounded text-amber-900 text-sm font-semibold py-2 px-4">
                            There are {lowStocks} products with less than 10 units in stock.
                            <span className="absolute right-0.5 -top-3 border-b-12 border-l-6 border-r-6 z-50 border-l-transparent border-r-transparent border-b-red-100">
                            </span>
                        </p>}
                        <BellRingIcon className='text-amber-600' />
                    </div>
                </div>
            </div>
        </header >

        {/* Filters Bar */}
        < div className="bg-white border-b border-gray-200 md:px-6 px-3 py-1 md:py-3" >
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div id='categoryscroll' className="flex overflow-x-auto w-full items-center md:gap-4 gap-2 md:flex-1">
                    {/* Category Filter */}
                    <div className="relative">
                        <select value={searchParam.get('category') || 'all'}
                            onChange={(e) => updateSearchParam('category', e.target.value === 'all' ? '' : e.target.value)}
                            className="appearance-none bg-white border border-gray-300 md:rounded-xl rounded-md  px-2 md:px-4 py-0.5 md:py-1.5 pr-6 md:pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option value={'all'}>All Categories</option>
                            {categories?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                updateSearchParam('status', e.target.value === 'all' ? '' : e.target.value);
                            }}
                            className="appearance-none bg-white border border-gray-300 md:rounded-xl rounded-md  px-2 md:px-4 py-0.5 md:py-1.5 pr-6 md:pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option value={'all'} >All Status</option>
                            <option value={'active'}>Active</option>
                            <option value={'inactive'}>Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {/* Price Filter */}
                    <div className="relative">
                        <select
                            value={priceFilter}
                            onChange={(e) => {
                                setPriceFilter(e.target.value);
                                updateSearchParam('price', e.target.value === 'all' ? '' : e.target.value);
                            }}
                            className="appearance-none bg-white border border-gray-300 md:rounded-xl rounded-md px-2 py-0.5 pr-6 md:px-4 md:py-1.5 md:pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option value={'all'}>All Prices</option>
                            <option value={'100-300'}>₹100-₹300</option>
                            <option value={'300-600'}>₹300-₹600</option>
                            <option value={'600-1000'}>₹600-₹1000</option>
                            <option value={'1000+'}>₹1000+</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="relative">
                        <select
                            value={availability}
                            onChange={(e) => {
                                setAvailability(e.target.value);
                                updateSearchParam('availability', e.target.value)
                            }}
                            className="appearance-none bg-white border border-gray-300 md:rounded-xl rounded-md px-2 py-0.5 pr-6 md:px-4 md:py-1.5 md:pr-8 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200">
                            <option disabled > Availability</option>
                            <option value={'instock'}>In Stock</option>
                            <option value={'outstock'}>Out Of Stock</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <button onClick={() => navigate(`/admin/glamgully/product/addnew`)} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-1.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>
        </div >

        <section>
            <ul className="flex justify-between gap-2 items-center md:px-4 px-2 md:text-base text-sm bg-gradient-to-tl via-pink-50 from-rose-50 to-purple-50 ">
                <li className=" md:w-1/3  md:px-4 py-3 font-semibold text-gray-700">Product Name</li>
                <li className="  md:px-4 py-3 font-semibold text-gray-700">Price</li>
                <li className="  md:px-4 py-3 font-semibold text-gray-700"><span className='hidden md:block'>Stocks</span><span className='md:hidden'>Qty</span></li>
                <li className="  md:px-4 py-3 font-semibold text-gray-700">Status</li>
                <li className="  md:px-4 py-3 font-semibold text-gray-700">Action<span className='md:hidden'>s </span> <span className='hidden md:inline'>Buttons</span></li>
            </ul>
            {products.length > 0 ? <>
                {products.map((product) => (
                    <ul key={product._id} className="flex justify-between items-center gap-2 px-2 md:px-4 bg-gray-100 ">
                        <li className="md:px-4 w-1/3 py-3">
                            <div onClick={() => navigate(`/product/${product._id}`)} className="flex cursor-pointer items-center gap-3">
                                <img
                                    src={product.productimage[0]}
                                    alt={product.title}
                                    className="w-12 h-12 rounded-xl hidden md:block object-cover border border-gray-200" />
                                <div>
                                    <p className="font-semibold text-gray-800 leading-none text-sm md:text-base">{product.title}</p>
                                    <p className="text-xs md:text-sm text-gray-500">{product.category}</p>
                                </div>
                            </div>
                        </li>
                        <li className="md:px-4 py-3">
                            <span className="font-semibold text-gray-800 text-sm md:text-base">{product.price}</span>
                        </li>
                        <li className="md:px-4 py-3">
                            <span className="text-gray-700 md:text-sm text-xs">{product.quantity}</span>
                        </li>
                        <li className="md:px-4 py-3">
                            <span onClick={async () => {
                                await editProduct({ ...product, isActive: !product.isActive }).catch(err => console.log(err.response.data))
                                getProductsAdmin(currentPage, filters).then((data) => {
                                    setProducts(data.products);
                                    setCategories(data.categories);
                                    setTotalProducts(data.totalProducts);
                                    setTotalPages(data.totalPages);
                                    setLowStocks(data.lowStocks);
                                })
                            }}
                                className={`${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} md:cursor-pointer capitalize  px-3 py-1 rounded-full md:text-sm text-xs font-medium flex items-center gap-1 w-fit`}>
                                <div className={`w-2 h-2 rounded-full ${product.isActive ? "bg-green-500 " : "bg-red-500 "}`}></div>
                                {product.isActive ? "active" : "Inactive"}
                            </span>
                        </li>
                        <li className="md:px-4 py-3">
                            <div className="flex items-center gap-2 pl-4 ">
                                <button onClick={() => navigate(`/admin/glamgully/product/${product._id}`, { state: product })} className="cursor-pointer md:bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white md:px-3 py-1.5 rounded-full text-sm font-medium transition-all">
                                    <Edit className="w-4 h-4 md:text-amber-100 text-blue-700" />
                                </button>
                                <button onClick={() => {
                                    deleteProduct(product._id).then(() => {
                                        getProductsAdmin(currentPage, filters).then((data) => {
                                            setProducts(data.products);
                                            setCategories(data.categories);
                                            setTotalProducts(data.totalProducts);
                                            setTotalPages(data.totalPages);
                                            setLowStocks(data.lowStocks);
                                        })
                                    });
                                }} className="cursor-pointer p-2 md:bg-red-500 rounded-full md:px-3 py-1.5 flex items-center gap-1 text-amber-50 font-semibold transition-colors">
                                    <Trash2 className="w-4 h-4 md:text-amber-100 text-red-500" />
                                </button>
                            </div>
                        </li>
                    </ul>
                ))}
            </> : <h1 className='text-center text-gray-500 font-semibold my-10'>No products found.</h1>}
        </section>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage(prev => (prev > 1 ? prev - 1 : 1))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${i + 1 === currentPage
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : totalPages))} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div >
    )
}

export default ProductsPage