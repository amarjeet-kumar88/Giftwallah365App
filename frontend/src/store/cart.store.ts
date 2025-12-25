import { create } from "zustand";
import api from "@/lib/axios";
import { Product } from "@/types";
import { useAuthStore } from "./auth.store";

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

  // 🔥 NEW
  buyNow: (product: Product) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  // 🔄 Load cart from DB
// 🔄 Load cart from DB (SAFE)
fetchCart: async () => {
  try {
    const res = await api.get("/cart");

    // ✅ Handle empty / null cart safely
    const itemsFromApi = res.data?.items || [];

    set({
      items: itemsFromApi.map((i: any) => ({
        product: i.product,
        qty: i.quantity,
      })),
    });
  } catch (err) {
    console.error("Failed to fetch cart", err);

    // fallback to empty cart
    set({ items: [] });
  }
},


  // ➕ Add to cart (LOGIN REQUIRED)
  addToCart: async (product) => {
    const { user } = useAuthStore.getState();

    if (!user) {
      alert("Please login to add items to cart");
      window.location.href = "/login";
      return;
    }

    await api.post("/cart", {
      productId: product._id,
      quantity: 1,
    });

    await useCartStore.getState().fetchCart();
    set({ isOpen: true });
  },

  // ❌ Remove from cart
  removeFromCart: async (productId) => {
    await api.delete(`/cart/${productId}`);
    await useCartStore.getState().fetchCart();
  },

  // ⚡ BUY NOW (DIRECT CHECKOUT FLOW)
  buyNow: async (product) => {
    const { user } = useAuthStore.getState();

    if (!user) {
      alert("Please login to continue");
      window.location.href = "/login";
      return;
    }

    // Clear existing cart on backend
    await api.delete("/cart");

    // Add single product
    await api.post("/cart", {
      productId: product._id,
      quantity: 1,
    });

    // Sync cart state
    await useCartStore.getState().fetchCart();

    // Ensure cart drawer stays closed
    set({ isOpen: false });
  },
}));
