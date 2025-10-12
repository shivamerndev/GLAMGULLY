import axios from "axios";

// handlePayment Function
export const handlePayment = async (amount, CreateOrderFunction) => {
    try {
        const orderres = await axios.post(`${import.meta.env.VITE_BASE_URL}/pay/order`, { amount: amount * 100 });
        const data = orderres.data.order;
        handlePaymentVerify(data, CreateOrderFunction);
    } catch (error) {
        console.log(error);
    }
}
// verifyPayment Function
const handlePaymentVerify = (data, CreateOrderFunction) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: data.amount,
        currency: data.currency,
        name: "GlamGully",
        description: " payment successfully",
        order_id: data?.id,
        handler: async (response) => {
            try {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/pay/verify`, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    amount: data.amount,
                });
                CreateOrderFunction()
            } catch (error) {
                console.error("Payment verification failed:", error);
            }
        },
        notes: {
            note: "Don't Address Saved here",
        },
        theme: { color: "#5f63b8" }
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
}