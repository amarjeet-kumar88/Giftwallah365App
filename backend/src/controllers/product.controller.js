import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import SearchLog from "../models/searchLog.model.js";

export const createProduct = async (req, res) => {
  const {
    title,
    description,
    mrp,
    price,
    stock,
    category,
  } = req.body;

  if (price > mrp) {
    return res.status(400).json({
      message: "Selling price cannot be greater than MRP",
    });
  }

  const discountPercent = Math.round(
    ((mrp - price) / mrp) * 100
  );

  const images = req.files.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));

  const product = await Product.create({
    title,
    description,
    mrp,
    price,
    discountPercent,
    stock,
    category,
    images,
  });

  res.status(201).json(product);
};


export const getProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate("category");

  res.json(products);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

export const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  res.json(product);
};

// 🔍 SEARCH PRODUCTS + LOG SEARCH TERM
export const searchProducts = async (req, res) => {
  const { q, minPrice, maxPrice, category } = req.query;

  const filter = {};

  if (q) {
    filter.title = { $regex: q, $options: "i" };

    // 🔥 SEARCH ANALYTICS (POPULAR TERMS)
    await SearchLog.findOneAndUpdate(
      { term: q.toLowerCase() },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter).sort({
    createdAt: -1,
  });

  res.json(products);
};



// 🔍 LIVE SEARCH SUGGESTIONS
export const searchSuggestions = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.json([]);
  }

  const products = await Product.find({
    title: { $regex: q, $options: "i" },
  })
    .select("title images price")
    .limit(5);

  res.json(products);
};

// 🔥 GET POPULAR SEARCH TERMS
export const popularSearches = async (req, res) => {
  const data = await SearchLog.find()
    .sort({ count: -1 })
    .limit(5)
    .select("term count -_id");

  res.json(data);
};

// 🔥 RELATED PRODUCTS
export const getRelatedProducts = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 🔹 keywords from title
  const keywords = product.title.split(" ").slice(0, 5).join("|");

  const relatedProducts = await Product.find({
    _id: { $ne: product._id }, // exclude current product
    $or: [
      { category: product.category },
      { title: { $regex: keywords, $options: "i" } },
    ],
  })
    .limit(8)
    .sort({ createdAt: -1 });

  res.json(relatedProducts);
};

// 🔥 CUSTOMERS ALSO BOUGHT
export const customersAlsoBought = async (req, res) => {
  const { id } = req.params;

  // 🛡️ Safety check
  if (!id) {
    return res.status(400).json({ message: "Product ID required" });
  }

  // 1️⃣ Find orders containing this product
  const orders = await Order.find({
    "items.product": id,
    status: { $ne: "CANCELLED" },
  }).limit(20);

  if (!orders.length) {
    return res.json([]);
  }

  // 2️⃣ Collect other product IDs
  const productIds = new Set();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.product.toString() !== id) {
        productIds.add(item.product.toString());
      }
    });
  });

  // 3️⃣ Fetch products
  const products = await Product.find({
    _id: { $in: [...productIds] },
  })
    .limit(8)
    .sort({ createdAt: -1 });

  res.json(products);
};

export const recommendedForUser = async (req, res) => {
  try {
    /* ================= GUEST USER ================= */
    if (!req.user || !req.user._id) {
      const trending = await Product.find({ isActive: true })
        .sort({ soldCount: -1, createdAt: -1 })
        .limit(8);

      return res.json(trending);
    }

    /* ================= LOGGED-IN USER ================= */
    const userId = req.user._id;

    // 1️⃣ Fetch user orders
    const orders = await Order.find({ user: userId }).populate(
      "items.product"
    );

    // 🛑 If no orders → fallback
    if (!orders.length) {
      const fallback = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(8);

      return res.json(fallback);
    }

    const purchasedProductIds = new Set();
    const categories = new Set();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product) {
          purchasedProductIds.add(item.product._id.toString());
          categories.add(item.product.category);
        }
      });
    });

    // 🛑 Safety: no categories found
    if (!categories.size) {
      const fallback = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(8);

      return res.json(fallback);
    }

    // 2️⃣ Recommend similar category products
    const recommendations = await Product.find({
      isActive: true,
      category: { $in: [...categories] },
      _id: { $nin: [...purchasedProductIds] },
    })
      .sort({ createdAt: -1 })
      .limit(8);

    // 🛑 If still empty → fallback
    if (!recommendations.length) {
      const fallback = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(8);

      return res.json(fallback);
    }

    res.json(recommendations);
  } catch (error) {
    console.error("Recommended products error:", error);
    res
      .status(500)
      .json({ message: "Failed to load recommendations" });
  }
};

export const recommendedForYou = async (req, res) => {
  let products;

  if (req.user) {
    // 🔥 Personalized (based on orders / views)
    products = await Product.find()
      .sort({ rating: -1 })
      .limit(8);
  } else {
    // 🌍 Guest users → trending products
    products = await Product.find()
      .sort({ numReviews: -1 })
      .limit(8);
  }

  res.json(products);
};

export const getProductsByCategory = async (req, res) => {
  const category = req.query.category?.toLowerCase(); // 🔥 FIX

  if (!category) {
    return res.status(400).json({ message: "Category required" });
  }

  const products = await Product.find({ category })
    .sort({ createdAt: -1 });

  res.json(products);
};
