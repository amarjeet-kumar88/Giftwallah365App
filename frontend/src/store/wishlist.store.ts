import { create } from "zustand";
import api from "@/lib/axios";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];

  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<boolean>;
  remove: (productId: string) => Promise<void>;

  // ✅ NEW (for ProductCard, Product page, etc.)
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  // 🔄 Load wishlist from backend
  fetch: async () => {
    const res = await api.get("/wishlist");
    set({ items: res.data });
  },

  // ❤️ Toggle wishlist (add/remove)
  toggle: async (productId) => {
    const res = await api.post("/wishlist", { productId });

    // keep old behaviour (safe)
    await get().fetch();

    return res.data.added; // true / false
  },

  // ❌ Remove explicitly
  remove: async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    await get().fetch();
  },

  // ⭐ CHECK IF PRODUCT IS WISHLISTED
  isWishlisted: (productId) => {
    return get().items.some((p) => p._id === productId);
  },
}));
