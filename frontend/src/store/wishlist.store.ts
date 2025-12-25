import { create } from "zustand";
import api from "@/lib/axios";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];
  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<boolean>;
  remove: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],

  fetch: async () => {
    const res = await api.get("/wishlist");
    set({ items: res.data });
  },

  toggle: async (productId) => {
    const res = await api.post("/wishlist", { productId });
    await useWishlistStore.getState().fetch();
    return res.data.added;
  },

  remove: async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    await useWishlistStore.getState().fetch();
  },
}));
