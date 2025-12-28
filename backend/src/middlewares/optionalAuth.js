import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    req.user = user || null;
    next();
  } catch {
    req.user = null;
    next();
  }
};
