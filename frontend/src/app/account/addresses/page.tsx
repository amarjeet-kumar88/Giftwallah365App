"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { MapPin, Plus, Phone, Home } from "lucide-react";
import AddressModal from "@/components/address/AddressModal";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Saved Addresses</h1>
            <p className="text-slate-400 text-sm">
              Manage your delivery locations
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-linear-to-r from-indigo-500 to-purple-600
              font-semibold shadow-lg
              hover:opacity-90 transition
            "
          >
            <Plus size={18} />
            Add Address
          </button>
        </div>

        {/* ================= ADDRESS LIST ================= */}
        {addresses.length === 0 && (
          <div
            className="text-center py-16
            bg-black/30 border border-white/10
            rounded-3xl"
          >
            <MapPin size={40} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">No saved addresses yet</p>
          </div>
        )}

        <div className="grid gap-4">
          {addresses.map((a) => (
            <div
              key={a._id}
              className="
                group p-5 rounded-2xl
                bg-black/40 backdrop-blur-xl
                border border-white/10
                hover:bg-white/5
                transition-all duration-300
              "
            >
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div
                  className="
                    h-12 w-12 rounded-xl
                    bg-white/10
                    flex items-center justify-center
                    group-hover:bg-indigo-500/20
                    transition
                  "
                >
                  <Home className="text-indigo-400" size={22} />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <p className="font-semibold text-lg">{a.fullName}</p>

                  <p className="text-slate-400 text-sm mt-1">
                    {a.addressLine}, {a.city}, {a.state} – {a.pincode}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                    <Phone size={14} />
                    {a.phone}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD ADDRESS MODAL ================= */}

      {open && (
        <AddressModal
          onClose={() => setOpen(false)}
          onUpdated={load}
        />
      )}
    </div>
  );
}
