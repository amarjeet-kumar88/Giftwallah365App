import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";
import { generateInvoicePdf } from "../utils/invoicePdf.js";
import { sendInvoiceEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { createNotification } from "./notification.controller.js";
// import { sendWhatsApp } from "../services/whatsapp.service.js"; // if exists

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.body || {};

  if (!addressId) {
    return res.status(400).json({ message: "Address is required" });
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const items = cart.items.map((i) => ({
    product: i.product._id,
    quantity: i.quantity,
    price: i.product.price,
  }));

  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* 🔥 CREATE RAZORPAY ORDER */
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  /* 🔥 SAVE ORDER */
  const order = await Order.create({
    user: userId,
    items,
    address: addressId,
    totalAmount,
    razorpayOrderId: razorpayOrder.id,
    status: "PENDING",
  });

  /* 🔔 NOTIFICATION */
  await createNotification({
    user: userId,
    title: "Order created",
    message: "Your order has been created. Please complete payment.",
    type: "ORDER",
    url: `/orders/${order._id}`,
  });

  res.status(201).json({
    order,
    razorpayOrder,
  });
};

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = "PAID";
  order.paymentId = razorpay_payment_id;
  await order.save();

  /* 🔔 NOTIFICATION */
  await createNotification({
    user: order.user,
    title: "Payment successful",
    message: "Your payment was successful. Order confirmed.",
    type: "ORDER",
    url: `/orders/${order._id}`,
  });

  await Cart.deleteOne({ user: order.user });

  const populatedOrder = await Order.findById(order._id)
    .populate("items.product")
    .populate("address")
    .populate("user");

  const pdfBuffer = await generateInvoicePdf(populatedOrder);

  await sendInvoiceEmail({
    to: populatedOrder.user.email || "test@example.com",
    subject: "Your GiftWallah Invoice",
    text: "Thank you for your order. Invoice attached.",
    pdfBuffer,
  });

  res.json({
    success: true,
    order: populatedOrder,
  });
};

/* ================= MY ORDERS ================= */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product")
    .populate("address")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* ================= DOWNLOAD INVOICE ================= */
export const downloadInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("address")
    .populate("user");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (["CANCELLED", "FAILED"].includes(order.status)) {
    return res.status(400).json({
      message: "Invoice not available for cancelled/failed orders",
    });
  }

  const pdfBuffer = await generateInvoicePdf(order);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  res.send(pdfBuffer);
};

/* ================= CANCEL ORDER ================= */
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const cancellableStatuses = ["PENDING", "PAID", "PROCESSING"];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      message: `Order cannot be cancelled after ${order.status}`,
    });
  }

  order.status = "CANCELLED";
  order.cancelReason = req.body.reason || "User cancelled";
  order.cancelComment = req.body.comment || "";
  order.cancelledAt = new Date();
  await order.save();

  /* 🔔 NOTIFICATION */
  await createNotification({
    user: order.user,
    title: "Order cancelled",
    message: "Your order has been cancelled successfully.",
    type: "ORDER",
    url: `/orders/${order._id}`,
  });

  res.json(order);
};

/* ================= UPDATE ORDER ADDRESS ================= */
export const updateOrderAddress = async (req, res) => {
  const { id } = req.params;
  const { addressId } = req.body;

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Order ID is required" });
  }

  if (!addressId) {
    return res.status(400).json({ message: "Address ID is required" });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.address = addressId;
  await order.save();

  await createNotification({
    user: order.user,
    title: "Address updated",
    message: "Delivery address updated for your order.",
    type: "ORDER",
    url: `/orders/${order._id}`,
  });

  const populatedOrder = await order.populate("address");
  res.json(populatedOrder);
};

/* ================= RETRY PAYMENT ================= */
export const retryOrderPayment = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order || order.status !== "FAILED") {
    return res.status(400).json({ message: "Invalid order" });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: `retry_${order._id}`,
  });

  order.razorpayOrderId = razorpayOrder.id;
  order.status = "PENDING";
  await order.save();

  await createNotification({
    user: order.user,
    title: "Retry payment",
    message: "Please retry payment to complete your order.",
    type: "ORDER",
    url: `/orders/${order._id}`,
  });

  res.json({ razorpayOrder });
};
