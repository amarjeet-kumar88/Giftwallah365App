"use client";

import api from "@/lib/axios";
import RatingStars from "./RatingStars";

export default function ReviewList({ reviews }: { reviews: any[] }) {
  const likeReview = async (reviewId: string) => {
    await api.put(`/reviews/like/${reviewId}`);
    // ⚠️ NOTE:
    // Ideally yahan parent se reviews reload karna chahiye
    // (next step me optimize karenge)
  };

  return (
    <div className="space-y-4 mt-6">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="p-4 rounded-xl
          bg-black/30 backdrop-blur
          border border-white/10"
        >
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-white">
                {r.user?.name || "User"}
              </p>

              {/* ✅ VERIFIED PURCHASE BADGE */}
              {r.verified && (
                <span className="text-xs text-emerald-400 font-semibold">
                  ✔ Verified Purchase
                </span>
              )}
            </div>

            <RatingStars value={r.rating} />
          </div>

          {/* ================= COMMENT ================= */}
          {r.comment && (
            <p className="text-sm text-slate-300 mt-2">
              {r.comment}
            </p>
          )}

          {/* ================= REVIEW IMAGES ================= */}
          {r.images && r.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {r.images.map((img: any) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt="Review image"
                  className="h-16 w-16 rounded-lg
                  object-cover border border-white/10"
                />
              ))}
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          <div className="mt-3 flex items-center gap-4 text-sm">
            {/* 👍 HELPFUL / LIKE BUTTON */}
            <button
              onClick={() => likeReview(r._id)}
              className="text-slate-400 hover:text-white transition"
            >
              👍 Helpful ({r.likes || 0})
            </button>

            {/* OPTIONAL: TIME */}
            <span className="text-slate-500 text-xs">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
