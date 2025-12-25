"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("FESTIVAL");
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const addCategory = async () => {
    if (!name) return alert("Enter category name");

    await api.post("/categories", { name, type });
    setName("");
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-10 text-white">
      {/* Header */}
      <h1 className="text-3xl font-extrabold tracking-tight">
        Categories
      </h1>

      {/* ADD CATEGORY */}
      <div
        className="max-w-lg rounded-3xl p-6
        bg-black/40 backdrop-blur-xl
        border border-white/10 shadow-2xl"
      >
        <h2 className="font-semibold text-lg mb-6 text-slate-200">
          Add Category
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm text-slate-300">
            Category Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Diwali, Birthday..."
            className="w-full mt-1 rounded-xl
              bg-black/30 border border-white/10
              px-4 py-3 text-white placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Type */}
        <div className="mb-6">
          <label className="text-sm text-slate-300">
            Category Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 rounded-xl
              bg-black/30 border border-white/10
              px-4 py-3 text-white
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="FESTIVAL">Festival</option>
            <option value="OCCASION">Occasion</option>
            <option value="CORPORATE">Corporate</option>
          </select>
        </div>

        <button
          onClick={addCategory}
          className="w-full bg-linear-to-r from-indigo-500 to-purple-600
            py-3 rounded-xl font-semibold shadow-lg
            hover:opacity-90 transition"
        >
          Add Category
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div
        className="rounded-3xl overflow-hidden
        bg-black/40 backdrop-blur-xl
        border border-white/10 shadow-2xl"
      >
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-300 uppercase tracking-wide">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4">Type</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat._id}
                className="border-t border-white/10
                  hover:bg-white/5 transition"
              >
                <td className="p-4 font-medium text-white">
                  {cat.name}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full
                    ${
                      cat.type === "FESTIVAL"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : cat.type === "OCCASION"
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {cat.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
