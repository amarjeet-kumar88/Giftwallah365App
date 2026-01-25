import express from "express";
import {
  getNotifications,
  markRead,
  markAllRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markRead);
router.put("/read-all", protect, markAllRead);


export default router;
