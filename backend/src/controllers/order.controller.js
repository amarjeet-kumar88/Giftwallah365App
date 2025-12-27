import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import razorpay from "../config/razorpay.js";
import { generateInvoicePdf } from "../utils/invoicePdf.js";
import { sendInvoiceEmail } from "../utils/sendEmail.js";
import crypto from "crypto";


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

  // 🔥 CREATE RAZORPAY ORDER
  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100, // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  // 🔥 SAVE ORDER IN DB (PENDING)
  const order = await Order.create({
    user: userId,
    items,
    address: addressId,
    totalAmount,
    razorpayOrderId: razorpayOrder.id,
    status: "PENDING",
  });

  res.status(201).json({
    order,
    razorpayOrder, // 🔥 THIS WAS MISSING
  });
};


export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  /* 1️⃣ VERIFY SIGNATURE */
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  /* 2️⃣ FIND ORDER (CORRECT FIELD) */
  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  /* 3️⃣ UPDATE ORDER */
  order.status = "PAID";
  order.paymentId = razorpay_payment_id;
  await order.save();

  /* 4️⃣ CLEAR CART */
  await Cart.deleteOne({ user: order.user });

  /* 5️⃣ POPULATE FOR INVOICE */
  const populatedOrder = await Order.findById(order._id)
    .populate("items.product")
    .populate("address")
    .populate("user");

  /* 6️⃣ GENERATE INVOICE */
  const pdfBuffer = await generateInvoicePdf(populatedOrder);

  /* 7️⃣ SEND EMAIL */
  await sendInvoiceEmail({
    to: populatedOrder.user.email || "test@example.com",
    subject: "Your GiftWallah Invoice",
    text: "Thank you for your order. Invoice attached.",
    pdfBuffer,
  });

  /* 8️⃣ RESPONSE */
  res.json({
    success: true,
    order: populatedOrder,
  });
};



export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product")
    .populate("address")
    .sort({ createdAt: -1 });

  res.json(orders);
};

export const downloadInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("address")     // 🔥 MUST
    .populate("user");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (["CANCELLED", "FAILED"].includes(order.status)) {
    return res.status(400).json({
      message: "Invoice not available for cancelled orders",
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

export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 🔐 Ensure same user
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // ❌ Already cancelled
  if (order.status === "CANCELLED") {
    return res.status(400).json({ message: "Order already cancelled" });
  }

  // 🚫 Cancellation rules (Flipkart style)
  const cancellableStatuses = ["PENDING", "PAID", "PROCESSING"];

  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      message: `Order cannot be cancelled after ${order.status}`,
    });
  }

  // ✅ Cancel order
  order.status = "CANCELLED";
  order.cancelReason = req.body.reason;
  order.cancelComment = req.body.comment || "";
  order.cancelledAt = new Date();

  await order.save();

  if (order.user?.phone) {
    await sendWhatsApp(
      order.user.phone,
      `❌ GiftWallah Order Cancelled
Your order #${order._id.toString().slice(-6)} has been cancelled.`
    );
  }

  res.json(order);
};
//   const { reason } = req.body;

//   const order = await Order.findById(req.params.id).populate("user");

//   if (!order) {
//     return res.status(404).json({ message: "Order not found" });
//   }

//   if (!["PENDING", "PAID", "PROCESSING"].includes(order.status)) {
//     return res
//       .status(400)
//       .json({ message: "Order cannot be cancelled now" });
//   }

//   order.status = "CANCELLED";
//   order.cancelReason = reason || "User cancelled";
//   await order.save();

//   // WhatsApp notify
//   if (order.user?.phone) {
//     await sendWhatsApp(
//       order.user.phone,
//       `❌ GiftWallah Order Cancelled
// Your order #${order._id.toString().slice(-6)} has been cancelled.`
//     );
//   }

//   res.json(order);
// };

export const updateOrderAddress = async (req, res) => {
  const { addressId } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status)) {
    return res
      .status(400)
      .json({ message: "Address cannot be updated now" });
  }

  order.address = addressId;
  order.addressUpdatedAt = new Date();
  await order.save();

  res.json(order);
};

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
  await order.save();

  res.json({ razorpayOrder });
};
