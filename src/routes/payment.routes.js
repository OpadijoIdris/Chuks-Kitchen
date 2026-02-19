import { Router } from "express";
import { makePayment } from "../controllers/payment.controller.js";

const router = Router();

router.put("/", makePayment);

export default router;