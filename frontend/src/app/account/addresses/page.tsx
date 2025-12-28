"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  MapPin,
  Plus,
  Phone,
  Home,
  Pencil,
  Trash2,
  Star,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import MapPicker from "@/components/address/MapPicker";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  /* FORM STATE */
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [activeAddressId, setActiveAddressId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    location: null as null | { lat: number; lng: number },
  });

  /* LOAD */
  const load = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* RESET FORM */
  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      location: null,
    });
    setMode("add");
    setActiveAddressId(null);
    setShowAddForm(false);
  };

  /* SAVE */
  const saveAddress = async () => {
    const { fullName, phone, addressLine, city, state, pincode, location } =
      form;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      toast.error("Please fill all fields");
      return;
    }

    // if (!location) {
    //   toast.error("Please pin location on map");
    //   return;
    // }

    try {
      if (mode === "add") {
        await api.post("/addresses", form);
        toast.success("Address added");
      } else if (activeAddressId) {
        await api.put(`/addresses/${activeAddressId}`, form);
        toast.success("Address updated");
      }

      resetForm();
      load();
    } catch {
      toast.error("Unable to save address");
    }
  };

  /* EDIT */
  const startEdit = (a: any) => {
    setMode("edit");
    setActiveAddressId(a._id);
    setShowAddForm(false);

    setForm({
      fullName: a.fullName,
      phone: a.phone,
      addressLine: a.addressLine,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      location: a.location || null,
    });
  };

  /* DEFAULT */
  const setDefault = async (id: string) => {
    try {
      setLoadingId(id);
      await api.put(`/addresses/${id}/default`);
      toast.success("Default address updated");
      load();
    } catch {
      toast.error("Unable to set default");
    } finally {
      setLoadingId(null);
    }
  };

  /* DELETE */
  const remove = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    try {
      setLoadingId(id);
      await api.delete(`/addresses/${id}`);
      toast.success("Address deleted");
      load();
    } catch {
      toast.error("Unable to delete");
    } finally {
      setLoadingId(null);
    }
  };

  /* ADDRESS FORM RENDER */
  const renderForm = () => (
    <div className="mt-4 rounded-3xl p-5 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">
          {mode === "add" ? "Add New Address" : "Edit Address"}
        </h3>
        <button onClick={resetForm}>
          <X size={18} className="text-slate-400 hover:text-white" />
        </button>
      </div>

      {[
        ["fullName", "Full Name"],
        ["phone", "Mobile Number"],
        ["addressLine", "Address"],
        ["city", "City"],
        ["state", "State"],
        ["pincode", "Pincode"],
      ].map(([k, label]) => (
        <input
          key={k}
          placeholder={label}
          value={(form as any)[k]}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, [k]: e.target.value }))
          }
          className="w-full mb-3 rounded-xl bg-black/30 border border-white/10 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ))}

      <div className="mt-5">
        <label className="text-sm text-slate-400 mb-2 block">
          Pin delivery location
        </label>
        <MapPicker
          value={form.location}
          onChange={(loc) =>
            setForm((prev) => ({ ...prev, location: loc }))
          }
        />
      </div>

      <button
        onClick={saveAddress}
        className="mt-3 w-full py-2.5 rounded-xl font-semibold
        bg-linear-to-r from-indigo-500 to-purple-600
        text-white shadow-lg hover:opacity-90"
      >
        {mode === "add" ? "Save Address" : "Update Address"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-10 bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827] text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Saved Addresses</h1>
            <p className="text-slate-400 text-sm">Manage delivery locations</p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setMode("add");
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-linear-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg"
          >
            <Plus size={18} /> Add Address
          </button>
        </div>

        {/* ADD FORM */}
        {mode === "add" && showAddForm && renderForm()}

        {/* LIST */}
        <div className="grid gap-4">
          {addresses.map((a) => (
            <div key={a._id}>
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex gap-4">
                  <Home className="text-indigo-400" />
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      <p className="font-semibold">{a.fullName}</p>
                      {a.isDefault && (
                        <span className="text-xs text-emerald-400 flex gap-1">
                          <Star size={12} /> Default
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm">
                      {a.addressLine}, {a.city}, {a.state} – {a.pincode}
                    </p>

                    <p className="text-slate-400 text-sm flex gap-1 mt-1">
                      <Phone size={14} /> {a.phone}
                    </p>

                    <div className="flex gap-5 mt-3 text-sm">
                      {!a.isDefault && (
                        <button
                          onClick={() => setDefault(a._id)}
                          className="text-emerald-400 hover:underline"
                        >
                          Set Default
                        </button>
                      )}

                      <button
                        onClick={() => startEdit(a)}
                        className="text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => remove(a._id)}
                        className="text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* EDIT FORM */}
              {mode === "edit" && activeAddressId === a._id && renderForm()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
