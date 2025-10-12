import React, { useContext, useEffect, useState } from 'react';
import {
    ArrowLeft,
    Save,
    Eye,
    Upload,
    X,
    Package,
    DollarSign,
    Percent,
    FileText,
    Grid3X3,
    Archive,
    Star,
    Camera,
    AlertCircle,
    UploadIcon,
    FilePlus,
    FilePlus2
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaFileDownload, FaRupeeSign } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { ProductDataContext } from '../context/ProductContext';

const AddOrEdit = () => {
    const { createProduct, editProduct } = useContext(ProductDataContext)
    const navigate = useNavigate()
    const { state } = useLocation()
    const { productId } = useParams()
    const [formData, setFormData] = useState(state || { title: "", price: "", description: "", category: "", quantity: "", discount: "", });
    const [limitedEdition, setLimitedEdition] = useState(false)
    const [draggedOver, setDraggedOver] = useState(false);
    const [productimg, setProductImg] = useState(state?.productimage || [])
    const [uploading, setUploading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleFileChange = (e) => {
        setProductImg([...e.target.files])
    }
    const handleSave = (e) => {
        e.preventDefault();
        if (state) {
            editProduct(formData).then(res => {
                toast.success("Product updated successfully.")
                setTimeout(() => {
                    navigate(-1)
                }, 3000);
            }).catch(err => toast.error(err.message))
        } else {
            const formObj = new FormData();
            if (!productimg.length) return toast.error("Product's Image required!");
            setUploading(true)

            productimg.forEach((file) => {
                if (file instanceof File) {
                    formObj.append("productimage", file)
                }
            })
            Object.entries(formData).forEach(([key, value]) => {
                formObj.append(key, value);
            });
            createProduct(formObj).then(res => {
                setUploading(false)
                toast.success(res.message)
                setTimeout(() => {
                    navigate(-1)
                }, 3000);
            }).catch(err => alert(err))
        }
    };
    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            productimage: prev.productimage.filter((_, i) => i !== index)
        }));
    };
    const calculateDiscountedPrice = () => {
        const price = parseFloat(formData.price) || 0;
        const discount = parseFloat(formData.discount) || 0;
        return (price - (price * discount / 100)).toFixed(2);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/80 to-orange-50/80">
            <ToastContainer />
            {/* Header */}
            <div className="flex items-center justify-between  sticky top-0 bg-amber-50/50 z-10 py-3 px-8 backdrop-blur-2xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Products
                </button>
                <h1 className="text-2xl font-semibold text-amber-900">{state ? "Edit Product" : "Add New Product"}</h1>
                <button onClick={() => document.getElementById("formsubmit").click()}
                    className="flex items-center gap-2 text-base px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 cursor-pointer text-white rounded-full font-semibold shadow-lg transition-all transform hover:scale-105">
                    {state ? <Save className="w-5 h-5" /> : <FilePlus className="w-5 h-5" />}
                    {state ? "Save Changes" : uploading ? "Uploading..." : "Add New Product"}
                </button>

            </div>
            <div className=" px-8 py-4">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div className="bg-white h-fit rounded-2xl shadow-xl py-4 px-6 border border-amber-200/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-amber-100 rounded-2xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-xl font-bold text-amber-900">Basic Information</h2>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <button className='hidden' id='formsubmit' type='submit'></button>
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-amber-900 mb-2">
                                    Product Title *
                                </label>
                                <input required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter product title"
                                    className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 font-medium" />
                            </div>

                            {/* Price and Discount */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                                        <FaRupeeSign className="w-4 h-4 inline mr-1" />
                                        Price *
                                    </label>
                                    <input required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                                        <Percent className="w-4 h-4 inline mr-1" />
                                        Discount (%)
                                    </label>
                                    <input required
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Price Preview */}
                            {formData.price && formData.discount && (
                                <div className="bg-gradient-to-br from-amber-200/60 via-orange-200/60 to-yellow-200/60 border border-orange-100 rounded-2xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-green-700 font-medium">Final Price</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-green-800">₹{calculateDiscountedPrice()}</span>
                                                <span className="text-lg text-gray-500 line-through">₹{formData.price}</span>
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                                                    {formData.discount}% OFF
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-green-700">You save</p>
                                            <p className="text-xl font-bold text-green-800">
                                                ₹{(parseFloat(formData.price) * parseFloat(formData.discount) / 100).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* limited */}
                            <div className="bg-amber-50 border select-none  border-amber-200 rounded-2xl p-6">
                                <div className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        id="limited"
                                        name="limitedEdition"
                                        checked={limitedEdition}
                                        readOnly
                                        onClick={() => setLimitedEdition(!limitedEdition)}
                                        className="w-5 h-5 text-amber-600 accent-amber-950 focus:ring-amber-500"
                                    />
                                    <label htmlFor="limited" className="text-amber-900 font-semibold cursor-pointer flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        Limited Edition Hai Kya?
                                    </label>
                                </div>
                                {limitedEdition && (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-300">
                                        <div className="flex items-center gap-2 text-amber-800">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                This product will be marked as Limited Edition and may have special pricing or availability restrictions.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Category and Stock */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                                        <Grid3X3 className="w-4 h-4 inline mr-1" />
                                        Category *
                                    </label>
                                    <input required
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="Category"
                                        className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                                        <Archive className="w-4 h-4 inline mr-1" />
                                        Stock Quantity *
                                    </label>
                                    <input required
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 font-medium" />
                                </div>
                            </div>
                            {/* description */}
                            <div>
                                <label className="block text-sm font-semibold text-amber-900 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter detailed product description..."
                                    rows={6}
                                    className="w-full px-4 py-2 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-amber-900 resize-none"
                                ></textarea>
                                <p className="text-sm text-amber-600 mt-2">
                                    {formData.description.length}/500 characters
                                </p>
                            </div>
                        </form>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Product Images */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                                    <Camera className="w-5 h-5 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-amber-900">Product Images</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Current Images */}
                                <div className="grid grid-cols-3 gap-4">
                                    {productimg.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img src={formData?.productimage ? image : URL.createObjectURL(image)}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-xl border-2 border-amber-200"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Upload Area */}
                                <div className={`border-2 border-dashed rounded-2xl py-4 text-center transition-all ${draggedOver ? 'border-amber-400 bg-amber-50' : 'border-amber-300 hover:border-amber-400 hover:bg-amber-50/50'}`}

                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDraggedOver(true);
                                    }}
                                    onDragLeave={() => setDraggedOver(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDraggedOver(false);
                                    }}>
                                    <input required multiple
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                    <p className="text-amber-700 font-medium mb-2">Drop images here or click to upload</p>
                                    <p className="text-sm text-amber-600">PNG, JPG up to 10MB each</p>
                                    <button onClick={() => document.getElementById("fileInput").click()} className="mt-4 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-medium hover:bg-amber-200 transition-colors">
                                        Choose Files
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-amber-200/60 via-yellow-200/70 to-orange-100 rounded-2xl shadow-xl px-4 py-2 border border-amber-200/50">
                            <h3 className="text-xl font-bold text-amber-900 mb-2">Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-700 font-medium">Category</span>
                                    <span className={`px-3 rounded-lg font-semibold flex bg-purple-300 text-purple-900 capitalize items-center gap-1`}>
                                        {formData.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-700 font-medium">Stock Level</span>
                                    <span className={`px-3 rounded-lg font-semibold ${parseInt(formData.quantity) > 100
                                        ? 'bg-green-100 text-green-800'
                                        : parseInt(formData.stocks) > 20
                                            ? 'bg-orange-400 text-yellow-800'
                                            : 'bg-red-200 text-red-800'
                                        }`}>
                                        {formData.quantity} units
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-amber-700 font-medium">Edition Type</span>
                                    <span className={`px-3 rounded-lg font-semibold flex items-center gap-1 ${formData.limitedEdition
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {formData.limitedEdition && <Star className="w-3 h-3" />}
                                        {formData.limitedEdition ? 'Limited Edition' : 'Regular'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOrEdit;