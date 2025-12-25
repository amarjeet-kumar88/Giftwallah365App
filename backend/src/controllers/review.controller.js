import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js"; //
import cloudinary from "../config/cloudinary.js";

// ⭐ ADD / UPDATE REVIEW
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.productId;
  const userId = req.user._id;

  let review = await Review.findOne({ user: userId, product: productId });

  if (review) {
    review.rating = rating;
    review.comment = comment;
  } else {
    review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });
  }

  // 🛍️ VERIFIED PURCHASE CHECK
  const hasPurchased = await Order.exists({
    user: userId,
    "items.product": productId,
    status: "DELIVERED",
  });

  review.verified = !!hasPurchased;

  // 🔥 IMPORTANT: SAVE REVIEW
  await review.save();

  // 🔄 RECALCULATE PRODUCT RATING
  const reviews = await Review.find({ product: productId });

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(avgRating.toFixed(1)), // ✅ number
    numReviews: reviews.length,
  });

  res.json(review);
};


// 📥 GET REVIEWS FOR PRODUCT
export const getProductReviews = async (req, res) => {
    const reviews = await Review.find({
        product: req.params.productId,
    }).populate("user", "name");

    res.json(reviews);
};

// ⭐ GET RATING DISTRIBUTION
export const getRatingStats = async (req, res) => {
    const productId = req.params.productId;

    const stats = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
            },
        },
    ]);

    const result = {
        total: 0,
        distribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        },
    };

    stats.forEach((s) => {
        result.distribution[s._id] = s.count;
        result.total += s.count;
    });

    res.json(result);
};

export const toggleLikeReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  const userId = req.user._id;

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const alreadyLiked = review.likedBy.some(
    (id) => id.toString() === userId.toString()
  );

  if (alreadyLiked) {
    review.likes -= 1;
    review.likedBy.pull(userId);
  } else {
    review.likes += 1;
    review.likedBy.push(userId);
  }

  await review.save();
  res.json(review);
};


export const uploadReviewImages = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const uploads = await Promise.all(
    req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "giftwallah/reviews",
      })
    )
  );

  review.images = uploads.map((u) => ({
    url: u.secure_url,
    public_id: u.public_id,
  }));

  await review.save();
  res.json(review);
};



export const getReviews = async (req, res) => {
  const { sort = "latest" } = req.query;

  let sortOption = { createdAt: -1 };

  if (sort === "helpful") sortOption = { likes: -1 };
  if (sort === "top") sortOption = { rating: -1, likes: -1 };

  const reviews = await Review.find({ product: req.params.productId })
    .sort(sortOption)
    .populate("user", "name");

  res.json(reviews);
};
