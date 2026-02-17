import dotenv from 'dotenv';
import express from 'express';
import sequelize from './config/database.js';
import "./models/index.js";
import userRouter from './routes/user.routes.js';
import foodRouter from './routes/food.routes.js';
import orderRouter from './routes/order.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/order", orderRouter);

app.get('/', (req, res) => {
  res.json({
    message: "Order system API currently working",
    time: new Date().toLocaleTimeString()
  });
});

const PORT = 3001;

// Start server only after DB connection
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.error("Database error:", err);
  });
