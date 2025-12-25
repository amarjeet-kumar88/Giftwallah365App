import Magnetic from "@/components/animations/Magnetic";

export default function PremiumButton({
  text,
}: {
  text: string;
}) {
  return (
    <Magnetic>
      <button
        className="group relative overflow-hidden rounded-2xl
        cursor-pointer
        px-8 py-4
        font-semibold tracking-wide
        text-white
        bg-linear-to-r from-indigo-500 via-purple-600 to-indigo-500
        shadow-[0_20px_40px_-15px_rgba(99,102,241,0.6)]
        transition-all duration-300
        hover:scale-[1.03]"
      >
        {/* Glow Layer */}
        <span
          className="absolute inset-0 opacity-0
          bg-linear-to-r from-amber-400/40 via-purple-500/40 to-indigo-500/40
          blur-xl
          transition-opacity duration-300
          group-hover:opacity-100"
        />

        {/* Hover Sweep */}
        <span
          className="absolute inset-0
          bg-linear-to-r from-white/0 via-white/20 to-white/0
          translate-x-full
          group-hover:translate-x-full
          transition-transform duration-700"
        />

        {/* Text */}
        <span className="relative z-10">
          {text}
        </span>
      </button>
    </Magnetic>
  );
}
