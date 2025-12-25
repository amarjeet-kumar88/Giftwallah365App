"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");

    await api.post("/auth/send-otp", { phone });
    router.push(`/otp?phone=${phone}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]"
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-8
        bg-black/40 backdrop-blur-xl
        border border-white/10 shadow-2xl text-white"
      >
        <h1 className="text-3xl font-extrabold mb-2 text-center">
          Login
        </h1>

        <p className="text-sm text-slate-400 text-center mb-6">
          Enter your phone number to receive OTP
        </p>

        {/* Phone Input */}
        <input
          placeholder="Phone number"
          className="w-full mb-5 rounded-xl
            bg-black/30 border border-white/10
            px-4 py-3 text-white placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={sendOtp}
          className="w-full py-3 rounded-xl
            cursor-pointer font-semibold
            bg-linear-to-r from-indigo-500 to-purple-600
            text-white shadow-lg
            hover:opacity-90 transition"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
