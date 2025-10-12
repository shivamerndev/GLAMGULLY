import mongoose from 'mongoose';

const PaymentSchema = mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const model = mongoose.model('payment', PaymentSchema);

export default model;