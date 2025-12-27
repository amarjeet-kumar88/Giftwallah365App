import { create } from "zustand";
import api from "@/lib/axios";
import { Product } from "@/types";
import { useAuthStore } from "./auth.store";
import toast from "react-hot-toast";

interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  open: () => void;
  close: () => void;

  fetchCart: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  inc: (productId: string) => Promise<void>;
  dec: (productId: string) => Promise<void>;
  buyNow: (product: Product) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  // 🔄 Load cart from DB (SAFE)
  fetchCart: async () => {
    try {
      const res = await api.get("/cart");
      const itemsFromApi = res.data?.items || [];

      set({
        items: itemsFromApi.map((i: any) => ({
          product: i.product,
          qty: i.quantity,
        })),
      });
    } catch (err) {
      console.error("Failed to fetch cart", err);
      set({ items: [] });
    }
  },

  // ➕ Add to cart
  addToCart: async (product) => {
    const { user } = useAuthStore.getState();

    if (!user) {
      toast.error("Please login to add items");
      window.location.href = "/login";
      return;
    }

    await api.post("/cart", {
      productId: product._id,
      quantity: 1,
    });

    await get().fetchCart();
    set({ isOpen: true });
  },

  // ❌ Remove item
  removeFromCart: async (productId) => {
    await api.delete(`/cart/${productId}`);
    await get().fetchCart();
  },

  // ➕ Increase qty
  inc: async (productId) => {
    await api.put("/cart", {
      productId,
      quantity: 1,
    });
    await get().fetchCart();
  },

  // ➖ Decrease qty
  dec: async (productId) => {
    await api.put("/cart", {
      productId,
      quantity: -1,
    });
    await get().fetchCart();
  },

  // ⚡ BUY NOW FLOW
  buyNow: async (product) => {
    const { user } = useAuthStore.getState();

    if (!user) {
      toast.error("Please login to continue");
      window.location.href = "/login";
      return;
    }

    // Clear cart
    await api.delete("/cart");

    // Add single product
    await api.post("/cart", {
      productId: product._id,
      quantity: 1,
    });

    toast.success("Item added. Proceed to checkout 🚀");

    await get().fetchCart();
    set({ isOpen: false });
  },
}));
