"use client";

import { useState } from "react";
import api from "@/lib/axios";
import RatingStars from "./RatingStars";

export default function ReviewForm({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async () => {
    await api.post(`/reviews/${productId}`, {
      rating,
      comment,
    });
    setComment("");
    onSuccess();
  };

  return (
    <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10">
      <h3 className="font-semibold mb-2">Write a Review</h3>

      <RatingStars value={rating} onChange={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        className="mt-3 w-full rounded-lg bg-black/30
        border border-white/10 p-2 text-sm"
      />

      <button
        onClick={submit}
        className="mt-3 px-4 py-2 rounded-lg
        bg-linear-to-r from-indigo-500 to-purple-600
        text-white font-semibold"
      >
        Submit Review
      </button>
    </div>
  );
}
