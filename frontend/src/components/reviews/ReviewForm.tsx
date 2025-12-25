"use client";

import { useState } from "react";
import api from "@/lib/axios";

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: any) => {
    setImages([...e.target.files].slice(0, 3));
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ CREATE / UPDATE REVIEW
      const res = await api.post(`/reviews/${productId}`, {
        rating,
        comment,
      });

      const reviewId = res.data._id;

      // 2️⃣ UPLOAD IMAGES (OPTIONAL)
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        await api.post(`/reviews/${reviewId}/images`, formData);
      }

      setComment("");
      setImages([]);
      onSuccess();
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl
      border border-white/10 space-y-4"
    >
      <h3 className="text-lg font-bold text-white">
        Write a Review
      </h3>

      {/* RATING */}
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full bg-black/50 border border-white/10
        rounded-lg px-3 py-2 text-white"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} ★
          </option>
        ))}
      </select>

      {/* COMMENT */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Share your experience..."
        className="w-full bg-black/50 border border-white/10
        rounded-lg px-3 py-2 text-white"
      />

      {/* IMAGE UPLOAD */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="text-sm text-slate-400"
      />

      {/* PREVIEW */}
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              className="h-16 w-16 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <button
        onClick={submitReview}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold
        bg-linear-to-r from-indigo-500 to-purple-600
        text-white hover:opacity-90 transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
