"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

const STATUSES = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/admin/orders").then((res) => setOrders(res.data));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await api.put(`/admin/orders/${id}/status`, { status });

    setOrders((prev) =>
      prev.map((o) => (o._id.toString() === id ? res.data : o))
    );
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <h1 className="text-3xl font-extrabold tracking-tight">
        Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-3xl p-6
              bg-black/40 backdrop-blur-xl
              border border-white/10 shadow-2xl"
          >
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 tracking-wider">
                  ORDER #{order._id.slice(-6)}
                </p>
                <p className="font-semibold text-lg">
                  {order.user?.name || "User"}
                </p>
              </div>

              {/* Status */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id.toString(), e.target.value)
                }
                className={`px-4 py-2 rounded-xl text-sm font-semibold
                  bg-black/30 border border-white/10 text-white
                  focus:outline-none focus:ring-2
                  ${
                    order.status === "PAID"
                      ? "focus:ring-emerald-500"
                      : order.status === "PROCESSING"
                      ? "focus:ring-indigo-500"
                      : order.status === "SHIPPED"
                      ? "focus:ring-amber-500"
                      : order.status === "DELIVERED"
                      ? "focus:ring-green-500"
                      : "focus:ring-rose-500"
                  }`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {order.items.map((i: any) => (
                <div
                  key={i._id}
                  className="flex justify-between text-sm text-slate-300"
                >
                  <span>
                    {i.product.title} × {i.quantity}
                  </span>
                  <span className="text-white font-medium">
                    ₹{i.price * i.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-white/10
              flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-emerald-400">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
