"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Download } from "lucide-react";
import OrderTimeline from "@/components/orders/OrderTimeline";
import AddressModal from "@/components/address/AddressModal";
import toast from "react-hot-toast";
import router from "next/router";
import CancelOrderModal from "@/components/orders/CancelOrderModal";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* 🔥 OPEN ADDRESS MODAL */
  const openAddressModal = (order: any) => {
    setActiveOrder(order);
  };

  const retryPayment = async (order: any) => {
    try {
      const { data } = await api.post(`/orders/${order._id}/retry`);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        order_id: data.razorpayOrder.id,

        handler: async (response: any) => {
          await api.post("/orders/verify", response);
          router.push("/order-success");
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled. You can retry.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Unable to retry payment");
    }
  };

  /* 📄 DOWNLOAD INVOICE */
  const downloadInvoice = async (orderId: string) => {
    const res = await api.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /* ❌ CANCEL ORDER */
  const cancelOrder = async (orderId: string) => {
    const reason = prompt("Why do you want to cancel this order?");
    if (!reason) return;

    const res = await api.put(`/orders/${orderId}/cancel`, { reason });
    toast.success("Order cancelled successfully");

    setOrders((prev) =>
      prev.map((o) => (o._id.toString() === orderId ? res.data : o))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-10 bg-[#0B0F1A] text-slate-300">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-[#0B0F1A] text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-10">My Orders</h1>

        {orders.length === 0 && (
          <p className="text-slate-400">You have no orders yet.</p>
        )}

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl p-6 bg-black/40 backdrop-blur-xl
              border border-white/10 shadow-2xl"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-400 tracking-wider">
                    ORDER #{order._id.toString().slice(-6)}
                  </p>

                  <p
                    className={`mt-1 inline-block text-sm font-semibold px-3 py-1 rounded-full
                    ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : order.status === "SHIPPED"
                        ? "bg-indigo-500/20 text-indigo-400"
                        : order.status === "PROCESSING"
                        ? "bg-amber-500/20 text-amber-400"
                        : order.status === "CANCELLED"
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>

                <CancelOrderModal
                  orderId={cancelOrderId}
                  onClose={() => setCancelOrderId(null)}
                  onSuccess={(updatedOrder) => {
                    setOrders((prev) =>
                      prev.map((o) =>
                        o._id === updatedOrder._id ? updatedOrder : o
                      )
                    );
                  }}
                />

                <button
                  onClick={() => downloadInvoice(order._id)}
                  disabled={order.status === "CANCELLED"}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-linear-to-r from-indigo-500 to-purple-600
                  text-white font-semibold shadow-lg cursor-pointer"
                >
                  <Download size={18} />
                  Invoice
                </button>
              </div>

              {/* TIMELINE */}
              <OrderTimeline status={order.status} />
              {order.status === "FAILED" && (
                <button
                  onClick={() => retryPayment(order)}
                  className="mt-6 w-full py-3 rounded-xl
    bg-amber-500 text-black font-semibold
    hover:bg-amber-400 transition"
                >
                  Retry Payment
                </button>
              )}

              {/* ITEMS */}
              <div className="mt-6 space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center border-b border-white/10 pb-4"
                  >
                    <img
                      src={item.product.images?.[0]?.url}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.product.title}</p>
                      <p className="text-sm text-slate-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-emerald-400">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="mt-6 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-400">₹{order.totalAmount}</span>
              </div>

              {/* ACTIONS */}
              {["PENDING", "PAID", "PROCESSING"].includes(order.status) && (
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => setCancelOrderId(order._id)}
                    className="px-5 py-2 rounded-xl
  border border-rose-500/40
  text-rose-400 font-semibold
  hover:bg-rose-500/10 transition"
                  >
                    Cancel Order
                  </button>

                  <button
                    onClick={() => openAddressModal(order)}
                    className="px-5 py-2 rounded-xl border border-indigo-500/40
                    text-indigo-400 font-semibold hover:bg-indigo-500/10 transition"
                  >
                    Change Address
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 ADDRESS MODAL */}
      {activeOrder && (
        <AddressModal
          orderId={activeOrder._id}
          onClose={() => setActiveOrder(null)}
          onUpdated={(updatedOrder) => {
            setOrders((prev) =>
              prev.map((o) =>
                o._id.toString() === updatedOrder._id.toString()
                  ? updatedOrder
                  : o
              )
            );
          }}
        />
      )}
    </div>
  );
}
