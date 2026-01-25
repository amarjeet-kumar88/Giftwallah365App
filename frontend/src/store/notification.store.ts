import { create } from "zustand";
import api from "@/lib/axios";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "ORDER" | "SYSTEM" | "OFFER";
  url?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  open: boolean;

  fetch: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  toggle: () => void;
  close: () => void;
  reset: () => void; // 🔥 logout support
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  open: false,

  /* UI */
  toggle: () =>
    set((state) => ({
      open: !state.open,
    })),

  close: () => set({ open: false }),

  reset: () =>
    set({
      items: [],
      unreadCount: 0,
      open: false,
    }),

  /* FETCH */
  fetch: async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔐 User logged out → skip fetch
      if (!token) {
        set({ items: [], unreadCount: 0 });
        return;
      }

      const res = await api.get("/notifications");

      const unread = res.data.filter(
        (n: Notification) => !n.isRead
      ).length;

      set({
        items: res.data,
        unreadCount: unread,
      });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // token expired / invalid
        set({ items: [], unreadCount: 0 });
        return;
      }

      console.error("Notification fetch failed", err);
    }
  },


  /* MARK SINGLE */
  markRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      // ⚡ Optimistic update (no full refetch)
      set((state) => ({
        items: state.items.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  },

  /* MARK ALL */
  markAllRead: async () => {
    try {
      await api.put("/notifications/read-all");

      set((state) => ({
        items: state.items.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error("Failed to mark all notifications read", err);
    }
  },
}));
