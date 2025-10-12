import express from 'express'
import upload from '../config/multer.config.js';
import adminAuth from '../middlewares/admin.auth.js'
import { createCustomerImage, readCustomerImage } from '../controllers/reviews.controller.js';

const router = express.Router()

router.post('/create', upload.single("reviewimg"), createCustomerImage)
router.get('/read', readCustomerImage)

export default router;