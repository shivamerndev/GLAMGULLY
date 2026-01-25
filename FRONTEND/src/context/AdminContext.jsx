import { useState } from 'react'
import { createContext } from 'react'
import { axiosAdminInstance } from '../utils/axios.instance'
import { HandleError } from '../utils/catchError'

export const AdminDataContext = createContext()

const AdminContext = ({ children }) => {

    const createAdmin = async (data) => {
        const response = await axiosAdminInstance.post("/register", data)
        return response.data
    }
    const LoginAdmin = async (data) => {
        try {
            const response = await axiosAdminInstance.post("/login", data)
            return response.data
        } catch (error) {
            console.error(error.message);
        }
    }
    const [admin, setAdmin] = useState(null)
    const GetAdminDashboard = async () => {
        try {
            const res = await axiosAdminInstance.get('/dashboard')
            setAdmin(res.data)
            return (res.data)
        } catch (error) {
            console.error(error.message)
        }
    }
    const LogoutAdmin = async () => {
        try {
            let res = await axiosAdminInstance.get('/logout')
            return (res);
        } catch (error) {
            console.log(error)
        }
    }
    const readOrders = async () => {
        try {
            const res = await axiosAdminInstance.get(`/orders`)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
    const allCustomers = async () => {
        try {
            const res = await axiosAdminInstance.get(`/customers`)
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
    const viewCustomerOrders = async (userId) => {
        try {
            const res = await axiosAdminInstance.get(`/customer/orders/${userId}`)
            return res.data;
        } catch (error) {
            console.log(error.response.data);
        }
    }
    const getOrderDetails = HandleError(async (orderId) => {
        const res = await axiosAdminInstance.get(`/order/${orderId}`)
        return (res.data)
    })
    const editOrderDetails = HandleError(async (orderId, status) => {
        const res = await axiosAdminInstance.put(`/order/${orderId}`, { status: status })
        return (res.data)
    })
    const AdminDashboardStats = HandleError(async () => {
        const res = await axiosAdminInstance.get("/admin/dashboard/stats")
        return res.data;
    })
    const AdminAnalytics = HandleError(async () => {
        const res = await axiosAdminInstance.get("/analytics")
        return res.data;
    })
    const CreateCouponCode = HandleError(async (data) => {
        const res = await axiosAdminInstance.post("/create-coupon", data)
        return res.data;
    })
    const getCouponCode = HandleError(async () => {
        const res = await axiosAdminInstance.get("/coupon")
        return res.data;
    })
    const deleteCouponCode = HandleError(async (couponId) => {
        const res = await axiosAdminInstance.delete(`/coupon/${couponId}`)
        return res.data;
    })
   const editCouponCode = HandleError(async (data) => {
        const res = await axiosAdminInstance.put("/coupon", {newObj:data})
        return res.data;
    })

    const createReviewImg = async (file) => {
        try {
            const formData = new FormData();
            formData.append("reviewimg", file); // backend me req.file naam ka milega

            const res = await axios.post(`https://glamgully.onrender.com/api/img/review/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            );
            return (res.data);
        } catch (error) {
            console.log(error);
        }
    }
    const readReviewsImg = async () => {
        try {
            const res = await axios.get(`https://glamgully.onrender.com/api/img/review/read`);
            return (res.data);
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <>
            <AdminDataContext.Provider value={{editCouponCode, deleteCouponCode, getCouponCode, CreateCouponCode, AdminAnalytics, AdminDashboardStats, viewCustomerOrders, editOrderDetails, getOrderDetails, admin, allCustomers, readOrders, createReviewImg, readReviewsImg, createAdmin, LoginAdmin, GetAdminDashboard, LogoutAdmin }}>
                {children}
            </AdminDataContext.Provider>
        </>
    )
}

export default AdminContext
