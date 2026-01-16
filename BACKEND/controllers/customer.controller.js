import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Address from "../models/address.model.js";
import orderModel from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";

export const registerCustomer = async (req, res) => {
    try {
        const { fullname, phone, email, password, gender } = req.body;

        // check if user already exists
        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const existingPhone = await Customer.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: "Phone Number already exist" });
        }

        // create new customer
        const user = await Customer.create({
            fullname,
            email,
            password,
            gender,
            phone,
        });

        // generate token
        const token = user.generateToken();

        // send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const loginCustomer = async (req, res) => {
    try {
        const { emailorphone, password } = req.body;
        if (!emailorphone || !password) return res.status(400).json({ message: "Email/Phone and password are required." });
        // find user with password
        const user = await Customer.findOne({ $or: [{ email: emailorphone }, { phone: emailorphone }] }).select("+password")
        if (!user) return res.status(400).json({ message: "Invalid email/phone or password" });
        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email/phone or password" });
        // generate token 
        const token = user.generateToken();
        // send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res.json({
            message: "Login successful",
            user: { _id: user._id, fullname: user.fullname, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
export const updateCustomer = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;
        // agar password change ho raha hai to hashing pre("save") se hoga
        const user = await Customer.findById(userId).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });
        Object.assign(user, updates); // merge updates
        await user.save();

        res.json({
            message: "User updated successfully",
            user: { _id: user._id, fullname: user.fullname, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getCustomerProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required." });
        }
        const user = await Customer.findById("68bebdf0119ae77d142e3197").select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate("wishlist");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate("cart.product");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAddresses = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).populate("address");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer.address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const customer = await Customer.findById(req.user.id);
        if (!customer.wishlist.includes(productId)) {
            customer.wishlist.push(productId);
            await customer.save();
        }
        res.status(200).json(customer.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const customer = await Customer.findById(req.user.id);
        customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
        await customer.save();
        res.status(200).json(customer.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const customer = await Customer.findById(req.user.id);
        const existingItem = customer.cart.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            customer.cart.push({ product: productId, quantity: quantity || 1 });
        }

        await customer.save();
        res.status(200).json(customer.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const customer = await Customer.findById(req.user.id);
        const item = customer.cart.find(i => i.product.toString() === productId);
        if (item) {
            item.quantity = quantity;
            await customer.save();
            res.status(200).json(customer.cart);
        } else {
            res.status(404).json({ message: "Product not in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const customer = await Customer.findById(req.user.id);
        customer.cart = customer?.cart?.filter(item => item.product.toString() !== productId);
        await customer.save();
        res.status(200).json(customer.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const placeOrderWithCart = async (req, res) => {
    const { shippingAddress, totalAmount } = req.body;
    try {
        if (!shippingAddress || !totalAmount) return res.status(400).send("Address or TotalAmount Required.")
        const customer = await Customer.findById(req.user.id).populate("cart.product")
        if (!customer) return res.status(401).send("Not Authorized.")
        if (customer.cart.length === 0) return res.status(404).send("Your Cart May Be Empty")
        // ✅ Create order
        const order = new Order({
            customer: customer._id,
            items: customer.cart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            totalAmount,
            shippingAddress
        });
        await order.save()

        // ✅ Decrease stock using Aggregation Pipeline update
        for (const item of customer.cart) {
            await Product.updateOne({ _id: item.product._id },
                [{
                    $set: {
                        // convert string->int, subtract quantity, convert back to string
                        quantity: { $toString: { $subtract: [{ $toInt: "$quantity" }, item.quantity] } }
                    }
                }]);
        }
        // ✅ Update customer
        customer.ordersHistory.push(order._id);
        customer.cart = [];
        await customer.save();

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const placeOrder = async (req, res) => {
    const { shippingAddress, totalAmount, buyquantity, products } = req.body;
    try {
        if (!shippingAddress || !totalAmount || !products || !buyquantity) return res.status(400).send("Some Required Data Missing..")
        const customer = await Customer.findById(req.user.id)
        if (!customer) return res.status(401).send("Not Authorized.")
        // ✅ Create order
        const order = new Order({
            customer: customer._id,
            items: [{
                product: products._id,
                quantity: buyquantity,
                price: products.price,
            }],
            totalAmount,
            shippingAddress
        });
        await Product.findOneAndUpdate({ _id: products._id }, [{ $set: { quantity: { $toString: { $subtract: [{ $toInt: "$quantity" }, { $toInt: buyquantity }] } } } }], { new: true });
        await order.save()
        // ✅ Update customer
        customer.ordersHistory.push(order._id);
        await customer.save();
        res.status(201).json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};
export const getOrdersHistory = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id).populate("ordersHistory").sort({ createdAt: -1 });
        res.status(200).json(customer.ordersHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSingleOrderDetails = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await orderModel.findById(orderId).populate([
            { path: "shippingAddress" },
            { path: "items.product" }
        ]);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const addAddress = async (req, res) => {
    try {
        const newAddress = new Address(req.body);
        await newAddress.save();

        const customer = await Customer.findById(req.user.id);
        customer.address.push(newAddress._id);
        await customer.save();

        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateAddress = async (req, res) => {
    try {
        const { isDefault } = req.body;
        const { addressId } = req.params;
        if (isDefault) {
            await Address.findOneAndUpdate({ isDefault: true }, { isDefault: false }, { new: true })
        }
        const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
        if (!updatedAddress) return res.status(404).json({ message: "Address not found" });
        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const removeAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        await Address.findByIdAndDelete(addressId);

        const customer = await Customer.findById(req.user.id);
        customer.address = customer.address.filter(id => id.toString() !== addressId);
        await customer.save();

        res.status(200).json({ message: "Address removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const syncCartItems = async (req, res) => {
    try {
        const userId = req.user._id; // middleware se aata hai
        const { items } = req.body;  // [{ product, quantity }]

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid cart data" });
        }

        const customer = await Customer.findById(userId);
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }

        // Merge logic → agar product already cart me hai to quantity update karen
        const updatedCart = [...customer.cart];
        items.forEach(newItem => {
            const existing = updatedCart.find(
                item => item.product.toString() === newItem._id
            );
            if (existing) {
                // Increase quantity (ya overwrite kar sakte ho)
                existing.quantity += newItem.quantity;
            } else {
                updatedCart.push({
                    product: newItem._id,
                    quantity: newItem.quantity,
                });
            }
        });
        customer.cart = updatedCart;
        await customer.save();

        res.status(200).json({
            message: "Cart synced successfully",
            cart: customer.cart,
        });
    } catch (err) {
        console.error("Cart sync error:", err);
        res.status(500).json({ message: "Server error, try again later" });
    }
}
export const sameOrderPlaced = async (req, res) => {
    const { orderId } = req.body
    try {
        const user = await Customer.findById(req.user.id)
        if (!user) return res.status(401).send("Not Authorized.")
        const completed = await Order.findById(orderId)
        if (completed.customer.toString() !== user._id.toString()) return res.status(400).send("Something went Wrong. May be bug.")
        const { shippingAddress, totalAmount, items, customer } = completed;
        // ✅ Create order
        const order = new Order({
            customer,
            items,
            totalAmount,
            shippingAddress
        });
        await order.save()
        // ✅ Decrease stock using Aggregation Pipeline update
        for (const item of completed.items) {
            await Product.updateOne({ _id: item.product._id },
                [{
                    $set: {
                        // convert string->int, subtract quantity, convert back to string
                        quantity: { $toString: { $subtract: [{ $toInt: "$quantity" }, item.quantity] } }
                    }
                }]);
        }
        // ✅ Update user
        user.ordersHistory.push(order._id);
        await user.save();
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const useCoupon = async (req, res) => {
    const { code, ordervalue, category } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ message: "Coupon is not active." });
        }
        if (coupon.applicableCategories.includes("all")) {
            console.log(coupon.applicableCategories);
        }
        else if (!coupon.applicableCategories.includes(category)) {
            return res.status(400).json({ message: `Coupon is not applicable for this category.` });
        }
        if (coupon.minOrderValue > ordervalue) {
            return res.status(400).json({ message: `Minimum order value should be ${coupon.minOrderValue} to apply this coupon.` });
        }
        // Check if coupon is expired
        if (new Date() > coupon.expirationDate) {
            return res.status(400).json({ message: "Coupon has expired." });
        }
        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit reached." });
        }
        const discounted = (ordervalue * coupon.discountPercentage) / 100;
        // Increment used count
        coupon.usedCount += 1;
        await coupon.save();
        res.status(200).json({ message: "Coupon applied successfully.", discounted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};