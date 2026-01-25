"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Bell, Package, Gift, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2592000, "week"],
    [31536000, "month"],
  ];

  for (let i = intervals.length - 1; i >= 0; i--) {
    const [secondsInUnit, label] = intervals[i];
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: "ORDER" | "OFFER" | "SYSTEM";
  url?: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch {
      toast.error("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= MARK READ ================= */
  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  /* ================= MARK ALL ================= */
  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  /* ================= ICON ================= */
  const Icon = ({ type }: { type: Notification["type"] }) => {
    if (type === "ORDER") return <Package className="text-indigo-400" />;
    if (type === "OFFER") return <Gift className="text-emerald-400" />;
    return <AlertCircle className="text-amber-400" />;
  };

  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-indigo-400" />
            <h1 className="text-3xl font-extrabold">Notifications</h1>
          </div>

          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllRead}
              className="text-sm text-indigo-400
              hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* ================= EMPTY ================= */}
        {!loading && notifications.length === 0 && (
          <div
            className="text-center py-20
            bg-black/30 border border-white/10
            rounded-3xl"
          >
            <CheckCircle size={40} className="mx-auto text-emerald-400 mb-4" />
            <p className="text-slate-400">You have no notifications</p>
          </div>
        )}

        {/* ================= LIST ================= */}
        {/* ================= LIST ================= */}
        <div className="space-y-4">
          {notifications.map((n) => {
            const Content = (
              <div
                onClick={() => !n.isRead && markRead(n._id)}
                className={`
          block p-5 rounded-2xl
          border cursor-pointer
          transition
          ${
            n.isRead
              ? "bg-black/30 border-white/10"
              : "bg-indigo-500/10 border-indigo-500/40"
          }
          hover:bg-white/5
        `}
              >
                <div className="flex gap-4">
                  {/* ICON */}
                  <div
                    className="h-10 w-10 rounded-xl
            bg-white/10 flex items-center justify-center"
                  >
                    <Icon type={n.type} />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-slate-400 mt-1">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {!n.isRead && (
                    <span
                      className="h-2.5 w-2.5 mt-2
              bg-indigo-400 rounded-full"
                    />
                  )}
                </div>
              </div>
            );

            return n.url ? (
              <Link key={n._id} href={n.url}>
                {Content}
              </Link>
            ) : (
              <div key={n._id}>{Content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
