// This script initializes the database and syncs all models

import sequelize from './src/config/database.js';
import User from './src/models/user.js';
import Food from './src/models/food.js';
import Order from './src/models/order.js';
import OrderItems from './src/models/orderItems.js';
import Payment from './src/models/payment.js';
import OTP from './src/models/otp.js';

const migrate = async () => {
    try {
        console.log('Starting database synchronization...');

        // Sync all models
        await sequelize.sync({ alter: false });

        console.log('Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

migrate();
