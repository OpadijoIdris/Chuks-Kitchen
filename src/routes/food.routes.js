import { Router } from "express";
import { createFood, getAllFood, getSingleFood, updateFood, deleteFood } from "../controllers/food.controller.js";

const router = Router();

router.post("/create", createFood);
router.get("/", getAllFood);
router.get("/:id", getSingleFood);
router.put("/update/:id", updateFood);
router.delete("/delete/:id", deleteFood);

export default router;
