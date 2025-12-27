"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cart.store";
import loadRazorpay from "@/lib/loadRazorpay";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!selected) {
        alert("Please select address");
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const orderRes = await api.post("/orders", {
        addressId: selected,
      });

      const { razorpayOrder } = orderRes.data;

      if (!razorpayOrder) {
        alert("Payment initialization failed");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,
        name: "GiftWallah365",
        description: "Secure Gift Purchase",
        handler: async (response: any) => {
          await api.post("/orders/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          window.location.href = "/order-success";
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
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/addresses").then((res) => setAddresses(res.data));
  }, []);

  const saveAddress = async () => {
    const res = await api.post("/addresses", form);
    setAddresses((prev) => [...prev, res.data]);
    setSelected(res.data._id);
  };

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-2">
        {/* LEFT – ADDRESS */}
        <div>
          <h2 className="text-2xl font-extrabold mb-6">Delivery Address</h2>

          {addresses.map((addr) => (
            <label
              key={addr._id}
              className={`block mb-4 cursor-pointer
                rounded-2xl p-4 border
                backdrop-blur-xl transition
                ${
                  selected === addr._id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-white/10 bg-black/30 hover:bg-white/5"
                }`}
            >
              <input
                type="radio"
                checked={selected === addr._id}
                onChange={() => setSelected(addr._id)}
                className="mr-3 accent-indigo-500"
              />
              <div className="inline-block align-top">
                <p className="font-semibold">{addr.fullName}</p>
                <p className="text-sm text-slate-400">
                  {addr.addressLine}, {addr.city}, {addr.state} – {addr.pincode}
                </p>
              </div>
            </label>
          ))}

          {/* ADD NEW ADDRESS */}
          <div
            className="mt-8 rounded-3xl p-5
            bg-black/40 backdrop-blur-xl
            border border-white/10 shadow-2xl"
          >
            <h3 className="font-semibold text-lg mb-4">Add New Address</h3>

            {[
              "fullName",
              "phone",
              "addressLine",
              "city",
              "state",
              "pincode",
            ].map((f) => (
              <input
                key={f}
                placeholder={f}
                className="w-full mb-3 rounded-xl
                  bg-black/30 border border-white/10
                  px-4 py-2 text-white placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              />
            ))}

            <button
              onClick={saveAddress}
              className="mt-2 w-full py-2.5 rounded-xl
                cursor-pointer font-semibold
                bg-linear-to-r from-indigo-500 to-purple-600
                text-white shadow-lg hover:opacity-90 transition"
            >
              Save Address
            </button>
          </div>
        </div>

        {/* RIGHT – SUMMARY */}
        <div
          className="h-fit rounded-3xl p-6
          bg-black/40 backdrop-blur-xl
          border border-white/10 shadow-2xl"
        >
          <h2 className="text-2xl font-extrabold mb-6">Order Summary</h2>

          {items.map((i) => (
            <div
              key={i.product._id}
              className="flex justify-between mb-3 text-sm text-slate-300"
            >
              <span>
                {i.product.title} × {i.qty}
              </span>
              <span className="text-white font-medium">
                ₹{i.product.price * i.qty}
              </span>
            </div>
          ))}

          <div className="my-5 border-t border-white/10" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-emerald-400">₹{total}</span>
          </div>

          <button
            disabled={!addresses || loading}
            onClick={handlePayment}
            className={`w-full py-3 rounded-xl font-semibold transition cursor-pointer
    ${
      !addresses
        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
        : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90"
    }
  `}
          >
            {loading ? "Processing..." : "Pay Securely"}
          </button>
        </div>
      </div>
    </div>
  );
}
