import Wishlist from "../models/wishlist.model.js";

/* GET MY WISHLIST */
export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products");

  res.json(wishlist?.products || []);
};

/* TOGGLE WISHLIST */
export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
    return res.json({ added: true });
  }

  const exists = wishlist.products.some(
    (p) => p.toString() === productId
  );

  if (exists) {
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );
    await wishlist.save();
    return res.json({ added: false });
  } else {
    wishlist.products.push(productId);
    await wishlist.save();
    return res.json({ added: true });
  }
};

/* REMOVE FROM WISHLIST */
export const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) return res.json([]);

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== req.params.id
  );

  await wishlist.save();
  res.json(wishlist.products);
};
