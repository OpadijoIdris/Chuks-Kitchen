import { DataTypes, Op } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }, 

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
            isEmail: true
        }
    },

    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }, 

    referralCode: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },

    referredBy: {
        type: DataTypes.UUID,
        allowNull: true
    },

    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    role: {
        type: DataTypes.ENUM("customer", "admin"), 
        defaultValue: "customer"
    }

}, { 
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['referralCode'],
            where: {
                referralCode: {
                    [Op.ne]: null
                }
            }
        }
    ] 
})

export default User;
