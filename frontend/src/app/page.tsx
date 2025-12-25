"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Product } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import PremiumButton from "@/components/ui/PremiumButton";
import RecentlyViewed from "@/components/RecentlyViewed";
import RecommendedForYou from "@/components/product/RecommendedForYou";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const byType = (type: string) =>
    products.filter((p) => p.category?.type === type);

  return (
    <div className="bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827] text-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 grid gap-14 md:grid-cols-2 items-center">
          {/* Left */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Gifts that{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500">
                Feel Personal
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-md">
              Premium gifts for festivals, birthdays, weddings &
              unforgettable moments.
            </p>

            <div className="mt-10">
              <PremiumButton text="Explore Gifts" />
            </div>
          </div>

          {/* Right image */}
          <div
            className="rounded-3xl p-6
            bg-black/40 backdrop-blur-xl
            border border-white/10 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a"
              className="rounded-2xl w-full object-cover"
              alt="Premium Gift"
            />
          </div>
        </div>
      </section>

      {/* ================= RECOMMENDED ================= */}
      <div className="max-w-7xl mx-auto px-4">
        <RecommendedForYou />
      </div>

      {/* ================= FESTIVAL ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold mb-8">
          Festival Specials
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={byType("FESTIVAL")} />
        )}
      </section>

      {/* ================= OCCASION ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold mb-8">
          Occasion Gifts
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={byType("OCCASION")} />
        )}
      </section>

      {/* ================= RECENTLY VIEWED ================= */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <RecentlyViewed />
      </div>
    </div>
  );
}
