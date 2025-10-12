
export const addToCartLocal = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    try {
        if (product) {
            // check if product already in cart
            const existingIndex = cart.findIndex(item => item._id === product._id);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;

            } else {
                cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        return cart.length;
    } catch (error) {
        console.log(error)
    }
};

export const addCartWithQuantity = (product, quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    try {
        if (product && quantity) {
            const existingIndex = cart.findIndex(item => item._id === product._id);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({ ...product, quantity: quantity });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    } catch (error) {
        console.log(error)
    }
};

export const getCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
};

export const removeFromCartLocal = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => {
    localStorage.removeItem("cart");
};

