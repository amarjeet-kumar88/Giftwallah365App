"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const submit = async () => {
    if (!title || !description || !mrp || !price || !category) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(price) > Number(mrp)) {
      alert("Selling price cannot be greater than MRP");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("mrp", mrp);
      form.append("price", price);
      form.append("stock", stock);
      form.append("category", category);

      if (images) {
        Array.from(images).forEach((img) =>
          form.append("images", img)
        );
      }

      await api.post("/products", form);
      alert("✅ Product added successfully");
      router.push("/admin/products");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto rounded-3xl
      bg-black/40 backdrop-blur-xl border border-white/10
      shadow-2xl p-6 md:p-8 text-white">

      <h1 className="text-3xl font-extrabold mb-8">
        Add New Product
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        {[
          { label: "Product Title *", type: "text", fn: setTitle, placeholder: "Premium Diwali Gift Box" },
          { label: "MRP (₹) *", type: "number", fn: setMrp, placeholder: "599" },
          { label: "Selling Price (₹) *", type: "number", fn: setPrice, placeholder: "399" },
          { label: "Stock", type: "number", fn: setStock, placeholder: "50" },
        ].map((f, i) => (
          <div key={i} className={i === 0 ? "md:col-span-2" : ""}>
            <label className="text-sm text-slate-300">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              onChange={(e) => f.fn(e.target.value)}
              className="w-full mt-1 rounded-xl bg-black/30 border border-white/10
                px-4 py-3 text-white placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Description *</label>
          <textarea
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 rounded-xl bg-black/30 border border-white/10
              px-4 py-3 text-white placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe the product..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm text-slate-200">Category *</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 rounded-xl bg-black/40 border border-white/10
              px-4 py-3 text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">Product Images *</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="mt-2 text-slate-300"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          disabled={loading}
          onClick={submit}
          className="bg-linear-to-r from-indigo-500 to-purple-600
            px-10 py-3 rounded-xl font-semibold shadow-lg
            hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        <button
          onClick={() => router.back()}
          className="px-10 py-3 rounded-xl border border-white/20
            hover:bg-white/5 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
