import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("success", "error"),
        allowNull: false
    },

    providerResponse: {
        type: DataTypes.TEXT
    }
}, { timestamps: true })

export default Payment;