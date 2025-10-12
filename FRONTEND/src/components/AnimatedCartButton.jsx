import { useContext, useState } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import '../../src/AnimatedCartButton.css';
import { addToCartLocal } from '../utils/local.cart'
import { ProductDataContext } from '../context/ProductContext';
import { CustomerDataContext } from '../context/CustomerContext';

const AnimatedCartButton = ({ product, pd }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [showAdded, setShowAdded] = useState(false);
    const { setlengthc } = useContext(ProductDataContext)
    const { addToCart, profile } = useContext(CustomerDataContext)

    const addCart = (product) => {
        if (pd) {
            pd()
        }
        else if (profile) {
            addToCart(product._id).then(res => setlengthc(res.length)).catch(err => { console.log(err.response.data); })
        }
        else {
            addToCartLocal(product)
            const cart = JSON.parse(localStorage.getItem("cart"))
            setlengthc(cart?.length)
        }
        cartClick()
    }

    const cartClick = () => {
        setIsClicked(true);
        // Show "Added" after cart animation
        setTimeout(() => setShowAdded(true), 1500);
        // Reset state after full animation
        setTimeout(() => {
            setIsClicked(false);
            setShowAdded(false);
        }, 2000);
    };

    return (
        <button onClick={() => { !showAdded ? addCart(product) : undefined }} className={`w-10/12 mx-auto ${pd ? "h-10" : "h-8"} text-sm bg-gradient-to-bl from-amber-800 to-amber-600 
text-white font-semibold mb-2 py-1 md:py-2 px-4 rounded-full 
transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl 
relative overflow-hidden cursor-pointer flex items-center justify-center gap-2`}>
            {isClicked && <ShoppingCart id='carticon' className=" w-5  sm:w-6 sm:h-6  z-20 top-1/2 absolute -translate-x-1/2 -translate-y-1/2" />}
            {!isClicked && <ShoppingCart className={`  w-4 h-4 ${pd ? "block" : "hidden"} sm:block `} />}
            {showAdded ? 'Added' : !isClicked ? 'Add to cart' : ""}
            {isClicked && <Package id='boxicon' className=" absolute z-30 -translate-x-1/2 -translate-y-1/2 w-3 h-3 " />}
        </button>
    )
};

export default AnimatedCartButton;
