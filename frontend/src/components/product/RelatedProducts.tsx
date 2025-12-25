"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

export default function RelatedProducts({
  productId,
}: {
  productId: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get(`/products/${productId}/related`)
      .then((res) => setProducts(res.data));
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      {/* ===== Heading ===== */}
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-white">
        Related Products
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
            {/* 🔥 SAME PRODUCT CARD */}
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
