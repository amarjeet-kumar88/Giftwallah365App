import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

export default router;
