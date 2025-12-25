// 🔥 NEW: Store for Recently Viewed Products

import { create } from "zustand";
import { Product } from "@/types";

interface RecentState {
  items: Product[];
  add: (product: Product) => void;
  loadFromStorage: () => void;
}

export const useRecentStore = create<RecentState>((set, get) => ({
  items: [],

  // ➕ Add product to recently viewed
  add: (product) => {
    const existing = get().items.filter(
      (p) => p._id !== product._id
    );

    const updated = [product, ...existing].slice(0, 8); // max 8

    set({ items: updated });

    // 💾 Persist to localStorage
    localStorage.setItem("recent-products", JSON.stringify(updated));
  },

  // 🔄 Load from localStorage on app start
  loadFromStorage: () => {
    const saved = localStorage.getItem("recent-products");
    if (saved) {
      set({ items: JSON.parse(saved) });
    }
  },
}));
