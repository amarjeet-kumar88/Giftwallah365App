import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import client from "../config/twilio.js";
import User from "../models/user.model.js";
import { sendWhatsApp } from "../utils/sendWhatsapp.js";

export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name phone")
    .populate("items.product", "title");

  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const allowed = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // 1️⃣ FIND ORDER
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 2️⃣ UPDATE STATUS
  order.status = status;
  await order.save(); // 🔥 DB UPDATE GUARANTEED

  // 3️⃣ RE-FETCH WITH POPULATE (VERY IMPORTANT)
  const updatedOrder = await Order.findById(order._id)
    .populate("user")
    .populate("items.product")
    .populate("address");

  // 4️⃣ SEND WHATSAPP (SIDE EFFECT)
  if (updatedOrder.user?.phone) {
    await sendWhatsApp(
      updatedOrder.user.phone,
      `📦 GiftWallah Update
Your order #${updatedOrder._id.toString().slice(-6)} is now *${status}*`
    );
  }

  // 5️⃣ RETURN UPDATED ORDER
  res.json(updatedOrder);
};


export const getDashboardStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();

  const revenueAgg = await Order.aggregate([
    { $match: { status: "PAID" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  const statusStats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const todayOrders = await Order.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });

  res.json({
    totalOrders,
    totalUsers,
    totalRevenue,
    todayOrders,
    statusStats,
  });
};