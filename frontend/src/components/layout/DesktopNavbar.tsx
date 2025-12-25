"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import SearchBar from "@/components/search/SearchBar";

export default function DesktopNavbar() {
  const { user, logout } = useAuthStore();
  const { open, items, fetchCart } = useCartStore();
  const {
    items: wishlistItems,
    fetch: fetchWishlist,
  } = useWishlistStore();

  // 🔄 Load cart & wishlist after login
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    }
  }, [user]);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header
      className="hidden md:block sticky top-0 z-40
      bg-black/60 backdrop-blur-xl
      border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 h-16
        flex items-center justify-between">

        {/* ===== LEFT: LOGO ===== */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="GiftWallah"
            width={42}
            height={42}
            className="transition-transform duration-500
            group-hover:rotate-6"
          />
          <span
            className="text-xl font-extrabold tracking-wide
            bg-linear-to-r from-white via-brand-gold to-white
            bg-size-[200%_100%]
            bg-clip-text text-transparent animate-shine"
          >
            Gift<span className="text-brand-gold">Wallah</span>
          </span>
        </Link>

        {/* ===== CENTER: SEARCH ===== */}
        <div className="flex-1 max-w-xl mx-8">
          <SearchBar />
        </div>

        {/* ===== RIGHT: ACTIONS ===== */}
        <div className="flex items-center gap-5">
          {/* ❤️ WISHLIST */}
          <Link
            href="/wishlist"
            className="relative text-slate-300 hover:text-white"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span
                className="absolute -top-1 -right-1
                bg-rose-500 text-white
                text-[11px] font-bold
                h-5 w-5 rounded-full
                flex items-center justify-center"
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🛒 CART */}
          <button
            onClick={open}
            className="relative text-white hover:opacity-90"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1
                bg-linear-to-br from-amber-400 to-orange-500
                text-black text-[11px] font-bold
                h-5 w-5 rounded-full
                flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* 👤 AUTH */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* ADMIN */}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl text-sm
                  bg-linear-to-r from-indigo-500 to-purple-600
                  text-white font-semibold shadow-lg"
                >
                  Admin
                </Link>
              )}

              {/* MY ORDERS */}
              <Link
                href="/orders"
                className="text-sm font-medium
                text-slate-300 hover:text-white"
              >
                My Orders
              </Link>

              {/* USER NAME */}
              <div className="flex items-center gap-2 text-slate-300">
                <User size={18} />
                <span className="text-sm">
                  {user.name || "User"}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="p-2 rounded-full
                text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl
              bg-linear-to-r from-indigo-500 to-purple-600
              text-white text-sm font-semibold shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
