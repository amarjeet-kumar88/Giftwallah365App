"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]"
    >
      <div
        className="max-w-md w-full text-center
        rounded-3xl p-8
        bg-black/40 backdrop-blur-xl
        border border-white/10 shadow-2xl text-white"
      >
        {/* Icon */}
        <CheckCircle
          size={72}
          className="mx-auto mb-5 text-emerald-400 drop-shadow-lg"
        />

        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-3">
          Order Placed Successfully 🎉
        </h1>

        {/* Subtext */}
        <p className="text-slate-400 mb-8">
          Thank you for shopping with{" "}
          <span className="text-white font-semibold">
            GiftWallah
          </span>
          . Your payment was completed successfully.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-block
          cursor-pointer
          px-8 py-3 rounded-2xl
          font-semibold text-lg
          bg-linear-to-r from-emerald-500 to-teal-600
          text-white shadow-lg
          hover:opacity-90 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
