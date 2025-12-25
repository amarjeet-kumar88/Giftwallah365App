"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
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
  const router = useRouter();

  // 🎯 Autofocus (mobile)
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // 🔍 Live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await api.get(`/products/search?q=${query}`);
      setResults(res.data);
      setOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🧹 Clear input
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect?.();
    inputRef.current?.focus();
  };

  // 🔗 Handle select
  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    clearSearch();
  };

  return (
    <div className="relative w-full">
      {/* INPUT */}
      <div
        className="flex items-center gap-2
        bg-white/10 backdrop-blur-xl
        border border-white/10
        rounded-xl px-3 py-2"
      >
        <Search size={18} className="text-slate-400 shrink-0" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gifts, occasions, festivals…"
          className="flex-1 bg-transparent outline-none
          text-white placeholder-slate-400
          text-sm"
        />

        {/* ❌ CLEAR ICON */}
        {query && (
          <button
            onClick={clearSearch}
            className="text-slate-400 hover:text-white"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {open && results.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-2
          bg-[#0B0F1A] border border-white/10
          rounded-xl shadow-xl z-50"
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
      )}
    </div>
  );
}
