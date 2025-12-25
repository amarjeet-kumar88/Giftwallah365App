"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export default function OtpPage() {
  const params = useSearchParams();
  const phone = params.get("phone")!;
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const verifyOtp = async () => {
    const res = await api.post("/auth/verify-otp", {
      phone,
      otp,
      name: name || undefined,
    });

    setAuth(res.data.user, res.data.token);

    if (res.data.user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]"
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-8
        bg-black/40 backdrop-blur-xl
        border border-white/10 shadow-2xl text-white space-y-5"
      >
        <h1 className="text-3xl font-extrabold text-center">
          Verify OTP
        </h1>

        <p className="text-sm text-slate-400 text-center">
          OTP sent to <span className="text-white font-medium">{phone}</span>
        </p>

        {/* OTP */}
        <input
          placeholder="Enter OTP"
          className="w-full rounded-xl
            bg-black/30 border border-white/10
            px-4 py-3 text-white placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* Name (First time users) */}
        <input
          placeholder="Your Name (first time only)"
          className="w-full rounded-xl
            bg-black/30 border border-white/10
            px-4 py-3 text-white placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={verifyOtp}
          className="w-full py-3 rounded-xl
            cursor-pointer font-semibold
            bg-linear-to-r from-indigo-500 to-purple-600
            text-white shadow-lg
            hover:opacity-90 transition"
        >
          Verify & Login
        </button>
      </div>
    </div>
  );
}
