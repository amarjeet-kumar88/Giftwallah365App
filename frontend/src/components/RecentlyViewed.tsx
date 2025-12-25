"use client";

import Link from "next/link";
import { useRecentStore } from "@/store/recent.store";

export default function RecentlyViewed() {
  const items = useRecentStore((s) => s.items);

  if (items.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="bg-black/40 border border-white/10
            rounded-2xl p-3 hover:scale-[1.02] transition"
          >
            <img
              src={p.images?.[0]?.url}
              className="h-40 w-full rounded-xl object-cover"
            />
            <p className="mt-2 text-sm font-semibold text-white line-clamp-1">
              {p.title}
            </p>
            <p className="text-emerald-400 font-bold">
              ₹{p.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
