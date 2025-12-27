"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setUser(res.data);
      setName(res.data.name || "");
    });
  }, []);

  const save = async () => {
    try {
      const res = await api.put("/users/profile", { name });
      setUser(res.data);
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto py-10 text-white">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      {/* PHONE (READ ONLY) */}
      <div className="mb-4">
        <label className="text-sm text-slate-400">Mobile Number</label>
        <input
          value={user.phone}
          disabled
          className="w-full mt-1 p-3 rounded-xl
          bg-black/40 border border-white/10
          text-slate-400 cursor-not-allowed"
        />
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm text-slate-400">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-3 rounded-xl
          bg-black/40 border border-white/10"
        />
      </div>

      <button
        onClick={save}
        className="mt-6 w-full py-3 rounded-xl
        bg-indigo-600 font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}
