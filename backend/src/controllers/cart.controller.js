import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const index = cart.items.findIndex(
    (i) => i.product.toString() === productId
  );

  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  res.json(cart);
};

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title images price"
  );
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
};

export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true });
};

export const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity += quantity;

  // ❌ Quantity <= 0 → remove item
  if (item.quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  }

  await cart.save();

  res.json(cart);
};
