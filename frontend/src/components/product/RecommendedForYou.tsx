"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

export default function RecommendedForYou() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  api
    .get("/products/recommended")
    .then((res) => setProducts(res.data))
    .finally(() => setLoading(false));
}, []);

  if (!products.length) return null;

  return (
    <section className="mt-20">
      {/* ===== Heading ===== */}
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-white">
        Recommended for you
      </h2>

      {/* ===== Grid ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* 🔥 REUSING SAME CARD */}
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
