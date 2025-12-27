"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import AddressModal from "@/components/address/AddressModal";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600"
        >
          Add Address
        </button>
      </div>

      {addresses.map((a: any) => (
        <div
          key={a._id}
          className="p-4 mb-4 rounded-xl bg-black/40 border border-white/10"
        >
          <p className="font-semibold">{a.fullName}</p>
          <p className="text-slate-400">{a.addressLine}</p>
        </div>
      ))}

      {/* <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={load}
      /> */}
    </div>
  );
}
