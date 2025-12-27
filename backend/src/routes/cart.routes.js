import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);
router.put("/", protect, updateCartQuantity);

export default router;
