import express from "express"
import { bestSellingProducts, createProduct, deleteProduct, editProduct, getAllProducts, getAllProductsAdmin, getSingleProduct, productCategory, productCategoryArchieve, productCategorypublic, searchProduct, searchProductForAdmin, TrendingProducts } from "../controllers/product.controller.js";
import adminAuth from "../middlewares/admin.auth.js";
import upload from "../config/multer.config.js";
import productModel from "../models/product.model.js";
const Router = express.Router()

Router.post("/create", adminAuth, upload.array("productimage", 5), createProduct)
// Router.post("/create", adminAuth, upload.single("productimage"), createProduct)
Router.get("/getproduct", getAllProducts)
Router.get("/best/products", bestSellingProducts)
Router.get("/getadminproduct", adminAuth, getAllProductsAdmin)
Router.get("/singleproduct/:productId", getSingleProduct)
Router.post("/editproduct", editProduct)
Router.post("/deleteproduct/:productId", deleteProduct)
Router.post("/search", searchProduct)
Router.post("/admin/search",adminAuth, searchProductForAdmin)
Router.get("/highest/price", async (req, res) => {
    try {
        const highest = await productModel.findOne({ isActive: true }).sort({ price: -1 }).select("price");
        res.status(200).send(highest.price)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
Router.get("/find/category", productCategory)
Router.get("/find/category/public", productCategorypublic)
Router.post("/archive/category", productCategoryArchieve)
Router.get("/trending/products", TrendingProducts)

export default Router;