import express from "express";
import upload from "../config/multer.js";
import {
  createProduct,
  getProducts,
  deleteProduct,
  getSingleProduct,
  searchProducts,
  searchSuggestions,
  popularSearches,
  getRelatedProducts,
  customersAlsoBought,
  recommendedForUser,
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
// import { optionalAuth } from "../middlewares/optionalAuth.js";

const router = express.Router();

// USER
router.get("/", getProducts);

// ADMIN
router.post(
  "/",
  protect,
  isAdmin,
  upload.array("images", 5),
  createProduct
);

router.get("/search", searchProducts);
router.get("/suggestions", searchSuggestions);
router.get("/popular-searches", popularSearches);
router.get("/:id/related", getRelatedProducts);
router.get("/:id/also-bought", customersAlsoBought);
router.get(
  "/recommended",
  protect,
  recommendedForUser
);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.get("/:id", getSingleProduct);


export default router;
