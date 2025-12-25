"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Product } from "@/types";
import { motion } from "framer-motion";

export default function RelatedProducts({ productId }: { productId: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get(`/products/${productId}/related`)
      .then((res) => setProducts(res.data));
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-20">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-white">
        Related Products
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p, index) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/products/${p._id}`}
              className="group block
              rounded-3xl p-3
              bg-black/40 backdrop-blur-xl
              border border-white/10
              shadow-xl
              cursor-pointer
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={p.images?.[0]?.url}
                  alt={p.title}
                  className="h-44 w-full object-cover
                  transition-transform duration-500
                  group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <p className="mt-3 font-semibold text-white line-clamp-1">
                {p.title}
              </p>

              <p className="mt-1 text-emerald-400 font-bold">
                ₹{p.price}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
