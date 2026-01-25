"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      console.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Shop by Category
          </h1>
          <p className="text-slate-400 mt-2">
            Explore gifts by category
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-3xl
                bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No categories found
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="group block h-full
                rounded-3xl p-5
                bg-black/40 backdrop-blur-xl
                border border-white/10
                hover:bg-white/5
                hover:-translate-y-1
                transition-all duration-300"
              >
                {/* IMAGE / ICON */}
                <div
                  className="h-24 w-full rounded-2xl
                  bg-white/5
                  flex items-center justify-center
                  overflow-hidden"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover
                      group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <Folder
                      size={36}
                      className="text-indigo-400"
                    />
                  )}
                </div>

                {/* NAME */}
                <p
                  className="mt-4 text-center
                  font-semibold text-lg
                  group-hover:text-indigo-400 transition"
                >
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
