import axios from 'axios';
import { createContext, useState } from 'react'
import { HandleError } from '../utils/catchError';
import { axiosCustomerInstance } from '../utils/axios.instance';
import { useNavigate } from 'react-router-dom';

export const CustomerDataContext = createContext();
const CustomerContext = ({ children }) => {

    const register = HandleError(async (data) => {
        const res = await axiosCustomerInstance.post('/register', data);
        return (res.data)
    })
    const login = HandleError(async (data) => {
        const res = await axiosCustomerInstance.post('/login', data);
        return (res.data)
    })
    const [profile, setProfile] = useState(null)
    const logout = HandleError(async (data) => {
        const res = await axiosCustomerInstance.post('/logout');
        setProfile(null)
        return (res.data.message);
    })
    const getprofile = HandleError(async () => {
        const res = await axiosCustomerInstance.get('/profile');
        setProfile(res.data)
        return (res.data)
    })
    const updateProfile = HandleError(async (data) => {
        const res = await axiosCustomerInstance.put('/update', data);
        return (res.data)
    })
    const updatePassword = HandleError(async (data) => {
        const res = await axiosCustomerInstance.put('/password', data);
        return (res.data)
    })
    const addWishlist = HandleError(async (productId) => {
        const res = await axiosCustomerInstance.post('/wishlist', { productId })
        return res.data
    })
    const removeWishlist = HandleError(async (productId) => {
        const res = await axiosCustomerInstance.delete('/wishlist', { data: { productId } });
        return (res.data);
    });
    const getWishlist = HandleError(async () => {
        const res = await axiosCustomerInstance.get('/wishlist')
        return res.data
    })
    const addToCart = HandleError(async (productId, quantity) => {
        const res = await axiosCustomerInstance.post('/cart', { productId, quantity })
        return res.data
    })
    const removeFromCart = HandleError(async (productId) => {
        const res = await axiosCustomerInstance.delete('/cart', { data: { productId: productId } })
        return res.data
    })
    const updateCart = HandleError(async (productId, quantity) => {
        const res = await axiosCustomerInstance.put('/cart', { productId, quantity })
        return res.data
    })
    const getCartItems = HandleError(async () => {
        const res = await axiosCustomerInstance.get('/cart')
        return res.data
    })
    const addAddress = HandleError(async (data) => {
        const res = await axiosCustomerInstance.post('/address', data)
        return (res.data)
    })
    const getAddresses = HandleError(async () => {
        const res = await axiosCustomerInstance.get('/address')
        return (res.data)
    })
    const editAddress = HandleError(async (data, id) => {
        const res = await axiosCustomerInstance.put(`/address/${id}`, data)
        return (res.data)
    })
    const deleteAddress = HandleError(async (id) => {
        const res = await axiosCustomerInstance.delete(`/address/${id}`)
        return (res.data)
    })
    const syncCartToDB = HandleError(async () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const res = await axiosCustomerInstance.post("/sync/cart", { items: cart });
        // Clear localStorage if you want
        localStorage.removeItem("cart");
        return (res.data.message)
    })
    const createOrderWithCart = HandleError(async (data) => {
        const res = await axiosCustomerInstance.post("/order/cart", data)
        return (res.data)
    })
    const createOrder = HandleError(async (data) => {
        const res = await axiosCustomerInstance.post("/order", data)
        return (res.data)
    })
    const createReOrder = HandleError(async (orderId) => {
        const res = await axiosCustomerInstance.post("/reorder", { orderId })
        return (res.data)
    })
    const sendNotification = HandleError(async (data) => {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/send-notification`, data)
        return (res.data);
    })
    const getOrderHistory = HandleError(async () => {
        const res = await axiosCustomerInstance.get("/orders")
        return (res.data)
    })
    const getOrderDetails = HandleError(async (orderId) => {
        const res = await axiosCustomerInstance.get(`/order/${orderId}`)
        return (res.data)
    })
    const getDiscount = HandleError(async (code,amount,category) => {
        const res = await axiosCustomerInstance.post(`/usecoupon`,{code:code,ordervalue:amount,category:category})
        return (res.data)
    })
    return (
        <>
            <CustomerDataContext.Provider value={{ getDiscount, sendNotification, createReOrder, getOrderDetails, getOrderHistory, createOrderWithCart, createOrder, profile, syncCartToDB, updatePassword, deleteAddress, editAddress, addAddress, getAddresses, getCartItems, removeFromCart, updateCart, addToCart, removeWishlist, addWishlist, getWishlist, logout, updateProfile, getprofile, login, register }}>
                {children}
            </CustomerDataContext.Provider>
        </>
    )
}

export default CustomerContext