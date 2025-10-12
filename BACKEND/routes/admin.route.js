import express from "express"
import { adminDashboard, adminLogin, adminLogout, adminRegister, allCustomers, allOrdersOfCustomer, editOrderDetails, getAdminDashboardStats, getAnalyticsData, getOrderDetails, readOrders } from "../controllers/admin.controller.js"
import adminAuth from "../middlewares/admin.auth.js"
const Router = express.Router()

Router.get("/", (req, res) => { res.send("admin page") })
Router.post("/register", adminRegister)
Router.post("/login", adminLogin)
Router.get("/dashboard", adminAuth, adminDashboard)
Router.get("/logout", adminAuth, adminLogout)
Router.get("/orders", adminAuth, readOrders)
Router.get("/customers", adminAuth, allCustomers)
Router.get("/customer/orders/:userId", adminAuth, allOrdersOfCustomer)
Router.get("/order/:orderId", adminAuth, getOrderDetails)
Router.put("/order/:orderId", adminAuth, editOrderDetails)
Router.get('/admin/dashboard/stats',adminAuth,getAdminDashboardStats)
Router.get('/analytics',adminAuth,getAnalyticsData)

export default Router;