"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  List,
  ShoppingBag,
  PackagePlus,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Add Product", href: "/admin/products/add", icon: PackagePlus },
  { name: "Categories", href: "/admin/categories", icon: List },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10 shadow-2xl">
      {/* Brand */}
      <div className="px-6 py-6 text-xl font-extrabold tracking-wide text-white">
        GiftWallah
        <span className="block text-xs font-normal text-slate-400">
          Admin Panel
        </span>
      </div>

      {/* Menu */}
      <nav className="px-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl
              text-slate-300 hover:text-white
              hover:bg-linear-to-r hover:from-indigo-500/20 hover:to-purple-500/20
              transition-all"
          >
            <item.icon
              size={20}
              className="text-slate-400 group-hover:text-white"
            />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
