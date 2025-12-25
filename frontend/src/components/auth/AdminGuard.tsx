"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return; // ⛔ WAIT

    if (!user) router.replace("/login");
    else if (user.role !== "ADMIN") router.replace("/");
  }, [hydrated, user]);

  if (!hydrated) return null;

  if (!user || user.role !== "ADMIN") return null;

  return <>{children}</>;
}
