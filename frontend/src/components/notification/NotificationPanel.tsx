"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/notification.store";

export default function NotificationPanel() {
  const {
    open,
    close,
    items,
    markRead,
    markAllRead,
  } = useNotificationStore();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-14 z-50
          w-80 max-h-[70vh]
          rounded-2xl overflow-hidden
          bg-black/80 backdrop-blur-xl
          border border-white/10 shadow-2xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-400 hover:underline"
            >
              Mark all read
            </button>
          </div>

          {/* LIST */}
          <div className="max-h-96 overflow-auto">
            {items.length === 0 && (
              <p className="p-4 text-center text-slate-400">
                No notifications
              </p>
            )}

            {items.map((n) => (
              <Link
                key={n._id}
                href={n.url || "#"}
                onClick={() => {
                  markRead(n._id);
                  close();
                }}
                className={`block px-4 py-3
                border-b border-white/5
                transition cursor-pointer
                ${
                  n.isRead
                    ? "bg-transparent"
                    : "bg-indigo-500/10"
                }
                hover:bg-white/5`}
              >
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {n.message}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
