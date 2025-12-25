import express from "express";
import {
  addReview,
  getProductReviews,
    getRatingStats,
    toggleLikeReview,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", protect, addReview);
router.get("/stats/:productId", getRatingStats);
router.put("/like/:reviewId", protect, toggleLikeReview);


export default router;
