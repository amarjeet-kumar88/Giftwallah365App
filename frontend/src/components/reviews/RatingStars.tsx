import { Star } from "lucide-react";

export default function RatingStars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={20}
          onClick={() => onChange?.(i)}
          className={`cursor-pointer
            ${i <= value ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}
          `}
        />
      ))}
    </div>
  );
}
