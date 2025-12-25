"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Products
        </h1>

        <a
          href="/admin/products/add"
          className="bg-linear-to-r from-indigo-500 to-purple-600
          px-6 py-2.5 rounded-xl font-semibold shadow-lg
          hover:opacity-90 transition"
        >
          + Add Product
        </a>
      </div>

      {/* Table */}
      <div className="rounded-3xl overflow-hidden border border-white/10
        bg-black/40 backdrop-blur-xl shadow-2xl">

        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-300 uppercase tracking-wide">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-medium text-white">
                  {p.title}
                </td>
                <td className="text-center text-emerald-400 font-semibold">
                  ₹{p.price}
                </td>
                <td className="text-center text-slate-300">
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
