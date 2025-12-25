import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addAddress,
  getAddresses,
} from "../controllers/address.controller.js";

const router = express.Router();

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);

export default router;
