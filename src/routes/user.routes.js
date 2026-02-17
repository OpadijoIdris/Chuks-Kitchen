import { Router } from "express";
import { register, verify, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verify);
router.get("/", getAllUsers);

export default router;