"use client";

import { Bell } from "lucide-react";
import { useEffect } from "react";
import { useNotificationStore } from "@/store/notification.store";

export default function NotificationBell() {
  const {
    unreadCount,
    toggle,
    fetch,
  } = useNotificationStore();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch();
}, []);

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-full
      hover:bg-white/10 transition"
    >
      <Bell size={22} />

      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1
          h-5 w-5 rounded-full
          bg-rose-500 text-white
          text-xs font-bold
          flex items-center justify-center"
        >
          {unreadCount}
        </span>
      )}
    </button>
  );
}
