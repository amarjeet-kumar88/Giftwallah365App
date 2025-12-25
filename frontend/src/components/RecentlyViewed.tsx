"use client";

import { useRecentStore } from "@/store/recent.store";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";
import { motion } from "framer-motion";

export default function RecentlyViewed() {
  const items = useRecentStore((s) => s.items) as Product[];

  if (!items.length) return null;

  return (
    <section className="mt-16">
      {/* ===== Heading ===== */}
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-white">
        Recently Viewed
      </h2>

      {/* ===== Grid ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* 🔥 SAME PRODUCT CARD */}
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
