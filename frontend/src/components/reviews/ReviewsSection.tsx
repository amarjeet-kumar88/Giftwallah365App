"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface ReviewsSectionProps {
  productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [sort, setSort] = useState("latest");

  const loadReviews = async () => {
    const res = await api.get(
      `/reviews/${productId}?sort=${sort}`
    );
    setReviews(res.data);
  };

  useEffect(() => {
    loadReviews();
  }, [sort]);

  return (
    <div className="mt-12 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-white">
          Customer Reviews
        </h2>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-black/50 border border-white/10
          rounded-lg px-3 py-2 text-white"
        >
          <option value="latest">Latest</option>
          <option value="helpful">Most Helpful</option>
          <option value="top">Top Rated</option>
        </select>
      </div>

      {/* REVIEW FORM */}
      <ReviewForm
        productId={productId}
        onSuccess={loadReviews}
      />

      {/* REVIEW LIST */}
      {reviews.length === 0 ? (
        <p className="text-slate-400">
          No reviews yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
            />
          ))}
        </div>
      )}
    </div>
  );
}
