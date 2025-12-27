import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getMyProfile, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/profile", protect, updateProfile);

export default router;
