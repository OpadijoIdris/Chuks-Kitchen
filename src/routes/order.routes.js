import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const router = Router(); 

router.post("/create", createOrder);
router.get("/user", getUserOrders);

export default router;