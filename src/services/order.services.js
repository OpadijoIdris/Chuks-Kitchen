import { Op } from "sequelize";
import sequelize from "../config/database.js";
import { Order, OrderItem, Food, Payment } from "../models/index.js";

export const createOrder = async (userId, items) => {
    const transaction = await sequelize.transaction();
    try {
        let totalAmount = 0

        const order = await Order.create({
            userId,
            totalAmount: 0,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        }, { transaction })

        for (const item of items) {
            const food = await Food.findByPk(item.foodId);

            if(!food) {
                throw new Error ("Food not found");
            }

            if(!food.isAvailable) {
                throw new Error (`${food.name} is not available`)
            }
            const subTotal = Number(food.price) * item.quantity;
            totalAmount += subTotal;

            await OrderItem.create({
                orderId: order.id,
                food: food.id,
                quantity: item.quantity,
                unitPrice: food.price,
                subTotal
            }, { transaction })
        }
        order.totalAmount = totalAmount;
        await order.save({ transaction });

        await transaction.commit();
        
        return order;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const getUserOrders = async (userId) => {
    return await Order.findAll({
        where: { userId },
        include: {
            model: OrderItem,
            include: Food,
        },
        order: [["createdAt", "DESC"]],
    })
};

export const getAllOrders = async (user) => {
    if(user.role === "admin") {
        throw new Error ("Only admins can access all orders");
    }

    return await Order.findAll({
        include: [
            {
                model: OrderItem,
                include: Food,
            }, 
            {
                model: Payment,
            }
        ],
        order: [["createdAt", "DESC"]],
    })
};

export const getOrderByStatus = async (status, user) => {
    if(user.role === "admin") {
        throw new Error ("Only admins can access orders by status")
    }

    return await Order.findAll({
        where: { status },
        include: [OrderItem, Payment],
    })
};

export const cancelOrder = async (orderId, user) => {
    if(user.role === "admin") {
        throw new Error("Only users can cancel orders");
    };

    const order = await Order.findByPk(orderId);

    if(!order) {
        throw new Error ("Order not found")
    }

    if(order.status === "paid") {
        throw new Error("Paid orders cannot be cancelled");
        
    }
    order.status = "cancelled"
    await order.save();

    return order
}

export const cancelExpiredOrders = async () => {
    const now = new Date();

    await Order.update(
        { status: "cancelled" },
        {
            where: {
                status: "pending",
                expiresAt: { [Op.lt]: now }
            }
        }
    )
};
