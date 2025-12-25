"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart.store";
import Link from "next/link";

export default function CartDrawer() {
  const { isOpen, close, items, removeFromCart } = useCartStore();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full sm:w-105
            bg-black/70 backdrop-blur-xl
            border-l border-white/10
            shadow-2xl flex flex-col text-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {/* Header */}
            <header className="p-4 flex justify-between items-center border-b border-white/10">
              <h3 className="font-semibold text-lg">
                Your Cart
              </h3>
              <button
                onClick={close}
                className="cursor-pointer text-slate-400 hover:text-white transition"
                aria-label="Close cart"
              >
                ✕
              </button>
            </header>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {items.length === 0 && (
                <p className="text-slate-400 text-center mt-16">
                  Your cart is empty
                </p>
              )}

              {items.map(({ product, qty }) => (
                <div
                  key={product._id}
                  className="flex gap-3 rounded-2xl p-3
                  bg-white/5 border border-white/10"
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-2">
                      {product.title}
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      ₹{product.price} × {qty}
                    </p>

                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-emerald-400">
                        ₹{product.price * qty}
                      </span>

                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="cursor-pointer text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <footer className="p-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    Total Amount
                  </span>
                  <span className="font-bold text-emerald-400">
                    ₹{total}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={close}
                  className="block text-center
                  cursor-pointer
                  py-3 rounded-xl font-semibold
                  bg-linear-to-r from-emerald-500 to-teal-600
                  text-white shadow-lg
                  hover:opacity-90 transition"
                >
                  Proceed to Checkout
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
