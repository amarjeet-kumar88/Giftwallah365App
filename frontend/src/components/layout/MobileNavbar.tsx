"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import { AnimatePresence, motion } from "framer-motion";

const NAVBAR_HEIGHT = 56; // h-14 = 56px

export default function MobileNavbar({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  const { open, items } = useCartStore();
  const [showSearch, setShowSearch] = useState(false);

  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  /* 🔒 CLOSE SEARCH ON OUTSIDE CLICK */
  useEffect(() => {
    if (!showSearch) return;

    const handler = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node) &&
        !searchBtnRef.current?.contains(e.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSearch]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className="md:hidden sticky top-0 z-50
        bg-black/70 backdrop-blur-xl
        border-b border-white/10"
      >
        <div className="h-14 px-4 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" width={34} height={34} alt="logo" />
            <span className="text-white font-bold">
              Gift<span className="text-brand-gold">Wallah</span>
            </span>
          </Link>

          {/* ICONS */}
          <div className="flex items-center gap-4 text-white">
            {/* 🔍 SEARCH */}
            <button
              ref={searchBtnRef}
              onClick={() => setShowSearch((v) => !v)}
              className="cursor-pointer"
            >
              <Search />
            </button>

            {/* 🛒 CART */}
            <button onClick={open} className="relative cursor-pointer">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="badge-sm">{cartCount}</span>
              )}
            </button>

            {/* ☰ MENU */}
            <button onClick={onMenuOpen} className="cursor-pointer">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= FLOATING SEARCH OVERLAY ================= */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, scale: 0.92, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed left-0 right-0 z-999"
            style={{ top: NAVBAR_HEIGHT + 8 }}
          >
            <div
              className="mx-4
              bg-[#0B0F1A]/95 backdrop-blur-xl
              border border-white/10
              rounded-2xl shadow-2xl p-3"
            >
              <SearchBar
                autoFocus
                onSelect={() => setShowSearch(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
