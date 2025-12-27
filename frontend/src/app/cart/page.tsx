"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";

export default function CartPage() {
  const {
    items,
    fetchCart,
    inc,
    dec,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const totalAmount = items.reduce(
    (sum, i) => sum + i.product.price * i.qty,
    0
  );

  // 🟢 EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center
        bg-[#0B0F1A] text-white px-4">
        <img
          src="/empty-cart.png"
          className="h-48 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-400 mb-6">
          Looks like you haven't added anything yet
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl
          bg-linear-to-r from-indigo-500 to-purple-600
          font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ===== CART ITEMS ===== */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-extrabold mb-4">
            Shopping Cart
          </h1>

          {items.map(({ product, qty }) => (
            <div
              key={product._id}
              className="flex gap-4 p-4 rounded-3xl
              bg-black/40 backdrop-blur-xl
              border border-white/10 shadow-xl"
            >
              {/* IMAGE */}
              <img
                src={product.images?.[0]?.url}
                className="h-24 w-24 rounded-2xl object-cover"
              />

              {/* INFO */}
              <div className="flex-1">
                <Link
                  href={`/products/${product._id}`}
                  className="font-semibold hover:underline"
                >
                  {product.title}
                </Link>

                <p className="text-slate-400 text-sm mt-1">
                  ₹{product.price}
                </p>

                {/* QTY */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => dec(product._id)}
                    className="h-8 w-8 rounded-full
                    border border-white/20
                    hover:bg-white/10"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {qty}
                  </span>

                  <button
                    onClick={() => inc(product._id)}
                    className="h-8 w-8 rounded-full
                    border border-white/20
                    hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeFromCart(product._id)}
                className="text-rose-400 hover:text-rose-300"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {/* ===== SUMMARY ===== */}
        <div className="rounded-3xl p-6
          bg-black/40 backdrop-blur-xl
          border border-white/10 shadow-xl
          h-fit">
          <h2 className="text-xl font-bold mb-4">
            Price Details
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total items</span>
              <span>{items.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-emerald-400">
                FREE
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 my-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-emerald-400">
              ₹{totalAmount}
            </span>
          </div>

          <Link
            href="/checkout"
            className="block text-center mt-6 py-3 rounded-xl
            bg-linear-to-r from-indigo-500 to-purple-600
            font-semibold hover:opacity-90"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
