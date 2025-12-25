import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // ORIGINAL PRICE (MRP / MARKUP)
    mrp: {
      type: Number,
      required: true,
    },

    // FINAL SELLING PRICE
    price: {
      type: Number,
      required: true,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
