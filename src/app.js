import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/database.js';
import "./models/index.js";
import userRouter from './routes/user.routes.js';
import foodRouter from './routes/food.routes.js';
import orderRouter from './routes/order.routes.js';
import paymentRouter from './routes/payment.routes.js';
import cron from 'node-cron';
import { cancelExpiredOrders } from './services/order.services.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);

app.get('/', (req, res) => {
  res.json({
    message: "Order system API currently working",
    time: new Date().toLocaleTimeString()
  });
});

const PORT = process.env.PORT || 3001;

// Export app for tests. Start server only when not in test environment.
if (process.env.NODE_ENV !== 'test') {
  // Start server only after DB connection
  sequelize.sync({ alter: false })
    .then(() => {
      console.log("Database connected");

      // start scheduled job to cancel expired orders every minute
      cron.schedule('* * * * *', async () => {
        try {
          await cancelExpiredOrders();
        } catch (err) {
          console.error('Failed to cancel expired orders:', err.message || err);
        }
      });

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });

    })
    .catch(err => {
      console.error("Database error:", err);
    });
}

export default app;
