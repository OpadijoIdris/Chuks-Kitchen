import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Otp = sequelize.define("Otp", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },

  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, { timestamps: true });

export default Otp;