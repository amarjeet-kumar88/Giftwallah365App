import express from "express";
import {
  addReview,
  getProductReviews,
    getRatingStats,
    toggleLikeReview,
  uploadReviewImages,
  getReviews,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", protect, addReview);
router.get("/stats/:productId", getRatingStats);
router.put("/like/:reviewId", protect, toggleLikeReview);
router.post(
  "/:reviewId/images",
  protect,
  upload.array("images", 3),
  uploadReviewImages
);
router.get("/", getReviews);


export default router;
