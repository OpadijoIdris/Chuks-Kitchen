import { Router } from "express";
import { createOrder, getUserOrders, getAllOrders, getOrderByStatus, cancelOrder } from "../controllers/order.controller.js";

const router = Router(); 

router.post("/create", createOrder);
router.get("/user", getUserOrders);
router.get("/all", getAllOrders);
router.get("/status", getOrderByStatus);
router.put("/cancel/:orderId", cancelOrder);

export default router;