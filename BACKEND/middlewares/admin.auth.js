import jwt from "jsonwebtoken"
import adminModel from "../models/admin.model.js"

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Token is not Available/UnAuthorized' });
        const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY)
        const admin = await adminModel.findOne({ _id: decoded._id })
        req.admin = admin;
        next()
    } catch (error) {
        res.status(401).send(error.message)
    }
}

export default adminAuth;