"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300 animate-pulse linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]">
        Loading dashboard...
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827] text-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Powerful insights & real-time store analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          gradient="from-emerald-500/90 to-teal-600/90"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          gradient="from-indigo-500/90 to-violet-600/90"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          gradient="from-amber-400/90 to-orange-500/90"
        />
        <StatCard
          title="Today Orders"
          value={stats.todayOrders}
          gradient="from-rose-500/90 to-pink-600/90"
        />
      </div>

      {/* Order Status */}
      <div className="mt-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
        <h2 className="text-lg font-semibold mb-6 text-slate-200">
          Order Status Overview
        </h2>

        <div className="space-y-4">
          {stats.statusStats.map((s: any) => (
            <div
              key={s._id}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-linear-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 transition"
            >
              <span className="capitalize text-slate-300">
                {s._id}
              </span>

              <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-black/40 text-white border border-white/20">
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== */
/* Premium Dark Stat Card */
/* ===================== */
function StatCard({
  title,
  value,
  gradient,
}: {
  title: string;
  value: any;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 bg-linear-to-br ${gradient}
      shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-wide text-white/80">
          {title}
        </p>
        <p className="mt-2 text-3xl font-extrabold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
