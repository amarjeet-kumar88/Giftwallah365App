"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";

export default function WishlistPage() {
  const { items, fetch, remove } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    fetch();
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Your wishlist is empty ❤️
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#0B0F1A] text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <div
              key={p._id}
              className="rounded-3xl p-4 bg-black/40 border border-white/10"
            >
              <img
                src={p.images?.[0]?.url}
                className="h-48 w-full rounded-2xl object-cover"
              />

              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="text-emerald-400 font-bold mt-1">
                ₹{p.price}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => addToCart(p)}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 font-semibold cursor-pointer"
                >
                  Move to Cart
                </button>

                <button
                  onClick={() => remove(p._id)}
                  className="px-4 py-2 rounded-xl border border-rose-500 text-rose-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
