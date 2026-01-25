import Notification from "../models/notification.model.js";

/* ================= GET ALL ================= */
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

/* ================= MARK ONE READ ================= */
export const markRead = async (req, res) => {
  const { id } = req.params;

  await Notification.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isRead: true }
  );

  res.json({ success: true });
};

/* ================= MARK ALL READ ================= */
export const markAllRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  res.json({ success: true });
};

/* ================= CREATE (INTERNAL USE) ================= */
export const createNotification = async ({
  user,
  title,
  message,
  type = "SYSTEM",
  url,
}) => {
  await Notification.create({
    user,
    title,
    message,
    type,
    url,
  });
};
