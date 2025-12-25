"use client";

import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const { toggle, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product._id);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl
      bg-black/40 backdrop-blur-xl
      border border-white/10
      shadow-xl hover:shadow-2xl
      transition-all"
    >
      <Link href={`/products/${product._id}`} className="block">
        {/* ================= IMAGE ================= */}
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.title}
            className="h-44 sm:h-52 w-full object-cover
            transition-transform duration-500
            group-hover:scale-110"
          />

          {/* DISCOUNT BADGE */}
          {product.discountPercent > 0 && (
            <span
              className="absolute top-3 left-3
              bg-amber-400/90 text-black
              text-xs font-bold
              px-3 py-1 rounded-full shadow"
            >
              {product.discountPercent}% OFF
            </span>
          )}

          {/* ================= RATING (BOTTOM LEFT) ================= */}
          <div
            className="absolute bottom-2 left-2
            flex items-center gap-1
            bg-black/60 backdrop-blur-md
            px-2 py-1 rounded-lg"
          >
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">
              {product.rating || 0}
            </span>
          </div>

          {/* ================= WISHLIST (BOTTOM RIGHT) ================= */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product._id);
            }}
            className="absolute bottom-2 right-2
            h-9 w-9 flex items-center justify-center
            rounded-full bg-black/60 backdrop-blur-md
            cursor-pointer transition
            hover:scale-110"
          >
            <Heart
              size={18}
              className={`transition ${
                wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-4">
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">
            {product.title}
          </h3>

          {/* PRICE */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-emerald-400">
              ₹{product.price}
            </span>

            {product.mrp && (
              <span className="text-sm line-through text-slate-400">
                ₹{product.mrp}
              </span>
            )}

            {product.discountPercent > 0 && (
              <span className="text-sm font-medium text-emerald-300">
                {product.discountPercent}% off
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ================= ACTION ================= */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full py-2.5 rounded-xl
          cursor-pointer
          text-sm font-semibold
          bg-linear-to-r from-indigo-500 to-purple-600
          text-white shadow-lg
          hover:opacity-90 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
