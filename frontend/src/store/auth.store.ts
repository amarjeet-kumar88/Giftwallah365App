import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

interface User {
  _id: string;
  name?: string;
  phone: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,

      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      },

      // 🔥 AUTO LOAD USER FROM TOKEN
      loadUser: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ hydrated: true });
          return;
        }

        try {
          const res = await api.get("/auth/me");
          set({
            user: res.data,
            token,
            hydrated: true,
          });
        } catch {
          localStorage.removeItem("token");
          set({ user: null, token: null, hydrated: true });
        }
      },
    }),
    {
      name: "giftwallah-auth",
      partialize: (state) => ({
        token: state.token,
      }),
    }
  )
);
