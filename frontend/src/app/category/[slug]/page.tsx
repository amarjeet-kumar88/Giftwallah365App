"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products?category=${slug}`
      );
      setProducts(res.data);
    } catch {
      console.error("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) load();
  }, [slug]);

  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold capitalize">
            {slug?.toString().replace("-", " ")}
          </h1>
          <p className="text-slate-400 mt-2">
            Explore gifts from this category
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl
                bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No products found in this category
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
