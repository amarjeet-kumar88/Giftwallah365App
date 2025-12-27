"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Props {
  autoFocus?: boolean;
  onSelect?: () => void;
}

export default function SearchBar({ autoFocus, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* 🎯 Autofocus (mobile) */
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      setOpen(true);
    }
  }, [autoFocus]);

  /* 🔍 Live search */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await api.get(`/products/search?q=${query}`);
      setResults(res.data);
      setOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* 🧹 Clear */
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect?.();
  };

  /* 🔗 Select product */
  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    clearSearch();
  };

  /* ❌ CLICK OUTSIDE TO CLOSE */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
        onSelect?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* INPUT */}
      <div
        className={`
        flex items-center gap-2
        bg-white/10 backdrop-blur-xl
        border border-white/10
        rounded-xl px-3 py-2
        transition-all duration-300
        ${open ? "ring-2 ring-indigo-500/40" : ""}
        `}
      >
        <Search size={18} className="text-slate-400 shrink-0" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search gifts, occasions, festivals…"
          className="flex-1 bg-transparent outline-none
          text-white placeholder-slate-400
          text-sm"
        />

        {/* ❌ CLEAR */}
        {query && (
          <button
            onClick={clearSearch}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      <div
        className={`
        absolute left-0 right-0 mt-2
        bg-[#0B0F1A]/95 backdrop-blur-xl
        border border-white/10
        rounded-xl shadow-2xl z-50
        transition-all duration-300 origin-top
        ${
          open && results.length
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }
        `}
      >
        {results.map((item) => (
          <button
            key={item._id}
            onClick={() => handleSelect(item._id)}
            className="w-full text-left px-4 py-3
            hover:bg-white/10 transition"
          >
            <p className="text-sm font-medium text-white">
              {item.title}
            </p>
            <p className="text-xs text-slate-400">
              ₹{item.price}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
