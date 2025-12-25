"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Props {
  orderId: string;
  onClose: () => void;
  onUpdated: (order: any) => void;
}

export default function AddressModal({ orderId, onClose, onUpdated }: Props) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* FETCH ADDRESSES */
  const loadAddresses = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
    if (res.data.length && !selected) {
      setSelected(res.data[0]._id);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  /* UPDATE ORDER ADDRESS */
  const updateOrderAddress = async () => {
    if (!selected) return alert("Select address");

    const res = await api.put(`/orders/${orderId}/address`, {
      addressId: selected,
    });

    onUpdated(res.data);
    onClose();
  };

  /* ADD NEW ADDRESS */
  const addNewAddress = async () => {
    const { fullName, phone, addressLine, city, state, pincode } = form;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return alert("Fill all address fields");
    }

    const res = await api.post("/addresses", form);

    setShowForm(false);
    setForm({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    });

    await loadAddresses();
    setSelected(res.data._id);
  };

  return (
    <div
      className="fixed inset-0 z-50
      flex items-center justify-center px-4
      bg-black/70 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6
        bg-black/70 backdrop-blur-xl
        border border-white/10 shadow-2xl text-white"
      >
        <h2 className="text-2xl font-extrabold mb-6">
          Select Delivery Address
        </h2>

        {/* ADDRESS LIST */}
        {!showForm && (
          <>
            <div className="space-y-3 max-h-64 overflow-auto pr-1">
              {addresses.map((a) => (
                <label
                  key={a._id}
                  className={`flex gap-3 p-4 rounded-2xl cursor-pointer
                  border transition
                  ${
                    selected === a._id
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    checked={selected === a._id}
                    onChange={() => setSelected(a._id)}
                    className="mt-1 accent-indigo-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-semibold">{a.fullName}</p>
                    <p className="text-sm text-slate-400">
                      {a.addressLine}, {a.city}, {a.state} – {a.pincode}
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      📞 {a.phone}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-8">
              <button
                onClick={() => setShowForm(true)}
                className="cursor-pointer text-indigo-400 font-semibold hover:underline"
              >
                + Add New Address
              </button>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl
                  cursor-pointer
                  border border-white/20 text-slate-300
                  hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={updateOrderAddress}
                  className="px-5 py-2 rounded-xl
                  cursor-pointer font-semibold
                  bg-linear-to-r from-indigo-500 to-purple-600
                  text-white shadow-lg hover:opacity-90 transition"
                >
                  Use This Address
                </button>
              </div>
            </div>
          </>
        )}

        {/* ADD ADDRESS FORM */}
        {showForm && (
          <>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(form).map((key) => (
                <input
                  key={key}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  className="rounded-xl px-4 py-2
                  bg-black/40 border border-white/10
                  text-white placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              ))}
            </div>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="cursor-pointer text-slate-400 hover:text-white transition"
              >
                ← Back
              </button>

              <button
                onClick={addNewAddress}
                className="px-6 py-2 rounded-xl
                cursor-pointer font-semibold
                bg-linear-to-r from-emerald-500 to-teal-600
                text-white shadow-lg hover:opacity-90 transition"
              >
                Save Address
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
