"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (q.trim()) {
        router.push(`/search?q=${q}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <input
      placeholder="Search gifts, occasions..."
      className="w-full px-4 py-3 rounded-xl
      bg-black/40 border border-white/10
      text-white outline-none"
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
}
