"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import MapPicker from "./MapPicker";

interface Props {
  orderId?: string;
  address?: any; // 👈 EDIT MODE DATA
  onClose: () => void;
  onUpdated?: (data?: any) => void;
}

export default function AddressModal({
  orderId,
  address,
  onClose,
  onUpdated,
}: Props) {
  const isEdit = Boolean(address); // 👈 MODE DETECT

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [showForm, setShowForm] = useState(isEdit); // 👈 EDIT → FORM OPEN

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    location: null as null | { lat: number; lng: number },
  });

  /* ================= PREFILL FORM (EDIT) ================= */
  useEffect(() => {
    if (address) {
      setShowForm(true); // open form automatically
      setForm({
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine: address.addressLine || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        location: address.location || null, // ✅ PREFILL MAP PIN
      });
    }
  }, [address]);

  /* ================= FETCH ADDRESSES ================= */
  const loadAddresses = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
    if (res.data.length && !selected) {
      setSelected(res.data[0]._id);
    }
  };

  useEffect(() => {
    if (!isEdit) loadAddresses();
  }, [isEdit]);

  /* ================= ORDER ADDRESS UPDATE ================= */
  const updateOrderAddress = async () => {
    if (!selected) return alert("Select address");

    if (!orderId) {
      onClose();
      return;
    }

    const res = await api.put(`/orders/${orderId}/address`, {
      addressId: selected,
    });

    onUpdated?.(res.data);
    onClose();
  };

  /* ================= SAVE (ADD / EDIT) ================= */
  const saveAddress = async () => {
    const { fullName, phone, addressLine, city, state, pincode } = form;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return alert("Fill all address fields");
    }

    if (isEdit) {
      await api.put(`/addresses/${address._id}`, form);
    } else {
      await api.post("/addresses", form);
    }

    onUpdated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl p-6 bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
        {/* ================= HEADER ================= */}
        <h2 className="text-2xl font-extrabold mb-6">
          {isEdit
            ? "Edit Address"
            : showForm
            ? "Add New Address"
            : "Select Delivery Address"}
        </h2>

        {/* ================= ADDRESS LIST ================= */}
        {!showForm && !isEdit && (
          <>
            <div className="space-y-3 max-h-64 overflow-auto pr-1">
              {addresses.map((a) => (
                <label
                  key={a._id}
                  className={`flex gap-3 p-4 rounded-2xl cursor-pointer border transition
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
                    <p className="text-sm text-slate-300 mt-1">📞 {a.phone}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setShowForm(true)}
                className="text-indigo-400 font-semibold hover:underline"
              >
                + Add New Address
              </button>

              <button
                onClick={updateOrderAddress}
                className="px-6 py-2 rounded-xl font-semibold
                bg-linear-to-r from-indigo-500 to-purple-600"
              >
                Use This Address
              </button>
            </div>
          </>
        )}

        {/* ================= ADD / EDIT FORM ================= */}
        {(showForm || isEdit) && (
          <>
            <div className="space-y-4">
              {[
                ["fullName", "Full Name"],
                ["phone", "Mobile Number"],
                ["addressLine", "Address"],
                ["city", "City"],
                ["state", "State"],
                ["pincode", "Pincode"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm text-slate-400">{label}</label>
                  <input
                    value={(form as any)[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl px-4 py-3
                    bg-black/40 border border-white/10
                    focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))}
            </div>

            {/* 📍 MAP PICKER */}
            <div className="mt-5">
              <label className="text-sm text-slate-400 mb-2 block">
                Pin delivery location on map
              </label>

              <MapPicker
                value={form.location}
                onChange={(loc) =>
                  setForm((prev) => ({
                    ...prev,
                    location: loc,
                  }))
                }
              />
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={saveAddress}
                className="px-8 py-3 rounded-xl font-semibold
                bg-linear-to-r from-indigo-500 to-purple-600"
              >
                {isEdit ? "Update Address" : "Save Address"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
