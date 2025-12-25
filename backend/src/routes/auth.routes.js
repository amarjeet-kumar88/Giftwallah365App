import express from "express";
import { sendOtp, verifyOtp, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// 🔥 THIS WAS MISSING
router.get("/me", protect, getMe);

export default router;
