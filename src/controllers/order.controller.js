import * as orderServices from "../services/order.services.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;
        if(!userId || !items) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid request body"
            })
        }
        const order = await orderServices.createOrder(userId, items)
        return res.status(201).json({
            success: true,
            order
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const order = await orderServices.getUserOrders(userId);

        if(!order) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json(order);
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getAllOrders = async (req, res) => {
    try {
        req.user = { role: req.body.role };
        const orders = await orderServices.getAllOrders(req.user);

        return res.status(200).json({
            success: true,
            orders
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getOrderByStatus = async (req, res) => {
    try {
        req.user = { role: req.body.role };
        const { status } = req.query;
        const orders = await orderServices.getOrderByStatus(status, req.user);

        if(!orders || orders.length === 0) {
            throw new Error ("No orders found for the given status")
        }

        return res.status(200).json({
            success: true,
            orders
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const cancelOrder = async (req, res) => {
    try {
        req.user = { role: req.body.role };
        const { orderId } = req.params;
        const order = await orderServices.cancelOrder(orderId, req.user);
        return res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}