import User from "../models/user.model.js";

// GET /api/users/me
export const getMyProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      message: "Name must be at least 2 characters",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true }
  );

  res.json(user);
};
