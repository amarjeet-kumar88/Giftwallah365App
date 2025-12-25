export default function RatingDistribution({ stats }: any) {
  return (
    <div className="space-y-2 mt-6">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = stats.distribution[star] || 0;
        const percent = stats.total
          ? Math.round((count / stats.total) * 100)
          : 0;

        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-8">{star}★</span>
            <div className="flex-1 h-2 bg-white/10 rounded">
              <div
                className="h-2 bg-yellow-400 rounded"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-10 text-right">{percent}%</span>
          </div>
        );
      })}
    </div>
  );
}
