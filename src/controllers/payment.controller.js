import { processPayment } from "../services/payment.services.js";

export const makePayment = async (req, res) => {
    try {
        const { orderId, userId } = req.body;
        const paymentResult = await processPayment(orderId, userId);
        return res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            paymentResult
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}