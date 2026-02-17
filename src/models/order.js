import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }, 

    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }, 

    status: {
        type: DataTypes.ENUM("pending", "paid", "failed", "cancelled"), 
        defaultValue: "pending"
    },

    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { timestamps: true });

export default Order;