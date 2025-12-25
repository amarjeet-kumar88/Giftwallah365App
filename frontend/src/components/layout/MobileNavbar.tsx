"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";
import SearchBar from "@/components/search/SearchBar";

export default function MobileNavbar({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  const { open, items } = useCartStore();
  const [showSearch, setShowSearch] = useState(false);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <header className="md:hidden sticky top-0 z-50
        bg-black/70 backdrop-blur-xl border-b border-white/10">
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
            <button onClick={() => setShowSearch(!showSearch)}>
              <Search />
            </button>

            <button onClick={open} className="relative">
              <ShoppingCart />
              {cartCount > 0 && <span className="badge-sm">{cartCount}</span>}
            </button>

            <button onClick={onMenuOpen}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="md:hidden px-4 mt-2">
          <SearchBar autoFocus />
        </div>
      )}
    </>
  );
}
