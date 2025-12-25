"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [price, setPrice] = useState(5000);

  useEffect(() => {
    api
      .get(`/products/search?q=${q}&maxPrice=${price}`)
      .then((res) => setProducts(res.data));
  }, [q, price]);

  return (
    <div className="min-h-screen px-6 py-10 bg-[#0B0F1A] text-white">
      <h1 className="text-2xl font-bold mb-6">
        Results for "{q}"
      </h1>

      {/* 🔥 PRICE FILTER */}
      <div className="mb-6">
        <label className="text-sm text-slate-400">
          Max Price: ₹{price}
        </label>
        <input
          type="range"
          min={100}
          max={10000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="bg-black/40 border border-white/10
            rounded-2xl p-3"
          >
            <img
              src={p.images?.[0]?.url}
              className="h-48 w-full rounded-xl object-cover"
            />
            <p className="mt-2 font-semibold">{p.title}</p>
            <p className="text-emerald-400 font-bold">
              ₹{p.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
