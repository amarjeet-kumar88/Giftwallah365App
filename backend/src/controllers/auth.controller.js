import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { sendOtpSMS } from "../services/sms.service.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";

// helper
const normalizePhone = (phone) => {
  if (phone.startsWith("+")) return phone;
  return `+91${phone}`;
};

// SEND OTP
export const sendOtp = async (req, res, next) => {
  try {
    let { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    phone = normalizePhone(phone);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpSMS(phone, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res, next) => {
  try {
    let { phone, otp, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    phone = normalizePhone(phone);

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const otpRecord = await Otp.findOne({ phone, otp: hashedOtp });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      if (!name) {
        return res.status(400).json({ message: "Name required" });
      }

      user = await User.create({
        phone,
        name,
        isVerified: true,
      });

      isNewUser = true;
    }

    await Otp.deleteMany({ phone });

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user,
      isNewUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};