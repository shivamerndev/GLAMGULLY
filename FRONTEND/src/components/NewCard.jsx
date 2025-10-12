import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedCartButton from "./AnimatedCartButton";
const NewCard = ({ product, wishlist, renderStars, toggleWishlist }) => {

    const navigate = useNavigate()

    return (
        <div onClick={(e) => {
            const tagName = e.target.tagName.toUpperCase();
            if (tagName !== "BUTTON" && tagName !== "PATH" && tagName !== "SVG") {
                navigate(`/product/${product?._id}`);
            }
        }}
            className=" mb-4 group bg-white cursor-pointer max-h-90 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100" >
            {/* Image Container */}
            < div className="relative sm:h-48 h-40 md:h-54 overflow-hidden" >
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    src={product.productimage[0] || "/default.png"}
                    alt={product.title} />

                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 sm:py-1 sm:px-3 py-0.5 rounded-full shadow-lg">
                    {(Number(product.discount) || 0) + 50}% <span className="hidden sm:inline">OFF</span>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute cursor-pointer top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
                    <Heart
                        className={`w-4 h-4 transition-colors duration-300 ${wishlist[product._id]
                            ? "fill-amber-900 text-amber-900"
                            : "text-gray-600 hover:text-red-500"
                            }`} />
                </button>

                {/* Quick Actions */}
                <div className="absolute hidden sm:block bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                        <div className="bg-white/90 cursor-pointer backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-lg">
                            <Eye className="w-4 h-4 text-gray-700" />
                        </div>
                        <button onClick={() => navigate('/cart')} className="bg-orange-500 cursor-pointer hover:bg-orange-600 p-2 rounded-full transition-colors shadow-lg">
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div >

            {/* Product Info */}
            < div className="pt-2 " >
                <h3 className="truncate sm:text-base text-sm font-semibold text-gray-800 mb-1 pl-2 leading-none line-clamp-2">
                    {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center sm:gap-2 pl-2 mb-1">
                    <div className="sm:flex hidden items-center gap-1">
                        {renderStars(product?.ratings)}
                    </div>
                    <Star className="text-yellow-500 fill-yellow-500  sm:hidden w-3 " />
                    <span className="text-sm px-1 sm:px-0 font-medium text-gray-700">
                        {product?.ratings?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-sm pl-2 sm:hidden whitespace-nowrap font-semibold text-gray-800">
                        ₹{product.price}.00
                    </span>
                    <span className="text-xs hidden md:block text-gray-500">
                        ({product.reviewsCount} reviews)
                    </span>
                </div>
                {/* Price */}
                <div className="sm:flex hidden items-center gap-2 sm:mb-4 mb-2">
                    <span className="sm:text-xl text-base px-2 whitespace-nowrap font-semibold text-gray-800">
                        ₹{product.price}.00
                    </span>
                    <span className="text-sm hidden md:block text-gray-500 line-through">
                        ₹{Number(product.price) * 2.5}0
                    </span>
                </div>
                <AnimatedCartButton product={product} />
            </div >
        </div >
    )
}

export default NewCard
