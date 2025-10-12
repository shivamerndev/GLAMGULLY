import express from 'express'
import { customerAuth } from "../middlewares/customers.auth.js";
import { loginCustomer, logoutCustomer, registerCustomer, updateCustomer, getCustomerProfile, addToWishlist, removeFromWishlist, addToCart, updateCartItem, removeFromCart, placeOrder, getOrdersHistory, addAddress, updateAddress, removeAddress, getWishlist, getCart, getAddresses, updatePassword, syncCartItems, placeOrderWithCart, getSingleOrderDetails, sameOrderPlaced } from "../controllers/customer.controller.js";
const router = express.Router()

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/logout", logoutCustomer);
router.put("/update", customerAuth, updateCustomer);
router.get("/profile", customerAuth, getCustomerProfile);
router.put("/password", customerAuth, updatePassword);
router.get("/wishlist", customerAuth, getWishlist);
router.post("/wishlist", customerAuth, addToWishlist);
router.delete("/wishlist", customerAuth, removeFromWishlist);
router.post("/cart", customerAuth, addToCart);
router.put("/cart", customerAuth, updateCartItem);
router.delete("/cart", customerAuth, removeFromCart);
router.get("/cart", customerAuth, getCart);
router.post("/sync/cart", customerAuth, syncCartItems)
router.post("/order/cart", customerAuth, placeOrderWithCart);
router.post("/order", customerAuth, placeOrder);
router.post("/reorder", customerAuth, sameOrderPlaced);
router.get("/orders", customerAuth, getOrdersHistory);
router.get("/order/:orderId", customerAuth, getSingleOrderDetails);
router.get("/address", customerAuth, getAddresses);
router.post("/address", customerAuth, addAddress);
router.put("/address/:addressId", customerAuth, updateAddress);
router.delete("/address/:addressId", customerAuth, removeAddress);

export default router;