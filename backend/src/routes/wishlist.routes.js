import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/", protect, toggleWishlist);
router.delete("/:id", protect, removeFromWishlist);

export default router;
