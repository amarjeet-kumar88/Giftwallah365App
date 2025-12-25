import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  getDashboardStats ,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/orders", protect, isAdmin, getAllOrders);
router.put("/orders/:id/status", protect, isAdmin, updateOrderStatus);
router.get("/dashboard", protect, isAdmin, getDashboardStats);

export default router;
