"use client";

// 🔥 CLIENT SIDE BOOTSTRAP (ZUSTAND + LOCAL STORAGE)

import { useEffect } from "react";
import { useRecentStore } from "@/store/recent.store";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔄 Restore recently viewed on app load
  useEffect(() => {
    useRecentStore.getState().loadFromStorage();
  }, []);

  return <>{children}</>;
}
