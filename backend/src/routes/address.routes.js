import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id/default", protect, setDefaultAddress);

export default router;
