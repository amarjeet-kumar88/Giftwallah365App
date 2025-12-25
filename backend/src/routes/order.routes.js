import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyOrders,
  downloadInvoice,
  cancelOrder,
  updateOrderAddress,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/my", protect, getMyOrders);
router.get("/:id/invoice", protect, downloadInvoice);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/address", protect, updateOrderAddress);

export default router;
