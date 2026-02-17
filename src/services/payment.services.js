import sequelize from "../config/database.js";
import { Order, Payment } from "../models/index.js";

export const processPayment = async (orderId, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized access to this order");
    }

    if (order.status !== "pending") {
      throw new Error("Order cannot be paid");
    }

    // 🔥 Check expiry
    if (new Date() > order.expiresAt) {
      order.status = "cancelled";
      await order.save({ transaction });
      throw new Error("Order has expired");
    }

    // 🔥 Simulate payment (80% success rate)
    const isSuccessful = Math.random() < 0.8;

    const payment = await Payment.create(
      {
        orderId: order.id,
        amount: order.totalAmount,
        status: isSuccessful ? "success" : "failed",
      },
      { transaction }
    );

    // Update order status
    order.status = isSuccessful ? "paid" : "failed";
    await order.save({ transaction });

    await transaction.commit();

    return {
      payment,
      order,
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
