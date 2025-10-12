import express from 'express'
import {createOrder, verifyPayment} from "../controllers/payment.controller.js"
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Payment route is working');
});

router.post('/order', createOrder);
router.post("/verify", verifyPayment);

export default router;