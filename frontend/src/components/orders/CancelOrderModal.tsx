"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const reasons = [
  "Ordered by mistake",
  "Found cheaper elsewhere",
  "Delivery time too long",
  "Changed my mind",
  "Other",
];

interface Props {
  orderId: string | null;
  onClose: () => void;
  onSuccess: (updatedOrder: any) => void;
}

export default function CancelOrderModal({
  orderId,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitCancel = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put(`/orders/${orderId}/cancel`, {
        reason,
        comment,
      });

      toast.success("Order cancelled successfully");
      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Order cannot be cancelled at this stage";

      toast.error(msg);
    }
  };

  return (
    <AnimatePresence>
      {orderId && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div
              className="w-full max-w-md rounded-3xl
              bg-[#0B0F1A] border border-white/10
              shadow-2xl p-6 text-white"
            >
              <h2 className="text-xl font-bold mb-4">Cancel Order</h2>

              {/* Reasons */}
              <div className="space-y-3 mb-4">
                {reasons.map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-rose-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              {/* Comment */}
              {reason === "Other" && (
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more (optional)"
                  className="w-full rounded-xl p-3 mb-4
                  bg-black/40 border border-white/10
                  text-sm text-white resize-none"
                />
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl
                  border border-white/20
                  text-slate-300 hover:bg-white/5"
                >
                  Keep Order
                </button>

                <button
                  onClick={submitCancel}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl
                  bg-rose-500 text-white font-semibold
                  hover:bg-rose-400 disabled:opacity-60"
                >
                  {loading ? "Cancelling..." : "Cancel Order"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
