"use client";

import { User } from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="h-16 px-6 flex items-center justify-between
      bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-lg">
      
      <h2 className="text-lg font-semibold text-white">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <User size={18} className="text-slate-300" />
        <span className="text-sm font-medium text-slate-200">
          Admin
        </span>
      </div>
    </header>
  );
}
