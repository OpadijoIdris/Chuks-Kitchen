import User from "./user.js";
import Order from "./order.js";
import Payment from "./payment.js";
import Otp from "./otp.js";
import OrderItem from "./orderItems.js";
import Food from "./food.js";

User.hasMany(Otp, { foreignKey: "userId", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(Payment, { foreignKey: "orderId", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Food.hasMany(OrderItem, { foreignKey: "foodId", onDelete: "CASCADE" });
OrderItem.belongsTo(Food, { foreignKey: "foodId" });

export { User, Otp, Order, Payment, OrderItem, Food };
