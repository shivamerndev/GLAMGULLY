import axios from "axios";

export const axiosProductInstance = axios.create({
    baseURL: import.meta.env.VITE_PRODUCT_BASE || "https://glamgully.onrender.com/api/product",
    withCredentials: true,
});

export const axiosAdminInstance = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BASE || "https://glamgully.onrender.com/api/admin",
    withCredentials: true,
})
export const axiosCustomerInstance = axios.create({
    baseURL: import.meta.env.VITE_USER_BASE || "https://glamgully.onrender.com/api/customers",
    withCredentials: true,
})