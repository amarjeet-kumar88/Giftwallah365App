export default function ProductSkeleton() {
  return (
    <div
      className="animate-pulse rounded-3xl p-4
      bg-black/40 backdrop-blur-xl
      border border-white/10 shadow-xl"
    >
      {/* Image */}
      <div className="h-40 rounded-2xl mb-4
        bg-linear-to-r from-white/5 via-white/10 to-white/5"
      />

      {/* Title */}
      <div className="h-4 rounded-lg w-3/4 mb-2
        bg-linear-to-r from-white/5 via-white/10 to-white/5"
      />

      {/* Price */}
      <div className="h-4 rounded-lg w-1/3
        bg-linear-to-r from-white/5 via-white/10 to-white/5"
      />
    </div>
  );
}
