import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Food = sequelize.define("Food", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    
}, { timestamps: true })

export default Food;