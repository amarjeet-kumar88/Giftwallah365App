"use client";

import { useState } from "react";
import { ThumbsUp, CheckCircle } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

interface ReviewCardProps {
  review: any;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const user = useAuthStore((s) => s.user);

  const [likes, setLikes] = useState<number>(review.likes || 0);
  const [liked, setLiked] = useState<boolean>(
    user ? review.likedBy?.includes(user._id) : false
  );

  const handleLike = async () => {
    if (!user) {
      alert("Please login to mark review helpful");
      return;
    }

    // 🔥 OPTIMISTIC UPDATE
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      await api.put(`/reviews/like/${review._id}`);
    } catch (err) {
      // ❌ ROLLBACK ON FAILURE
      setLiked(liked);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div
      className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl
      border border-white/10 space-y-3"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">
            {review.user?.name || "User"}
          </p>

          {review.verified && (
            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-1">
              <CheckCircle size={14} />
              Verified Purchase
            </div>
          )}
        </div>

        <span className="text-yellow-400 font-bold">
          {review.rating} ★
        </span>
      </div>

      {/* COMMENT */}
      <p className="text-slate-300 text-sm leading-relaxed">
        {review.comment}
      </p>

      {/* REVIEW IMAGES */}
      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.images.map((img: any) => (
            <img
              key={img.url}
              src={img.url}
              alt="review"
              className="h-16 w-16 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 text-sm font-medium
        ${liked ? "text-emerald-400" : "text-slate-400"}
        hover:text-emerald-300 transition`}
      >
        <ThumbsUp size={16} />
        Helpful ({likes})
      </button>
    </div>
  );
}
