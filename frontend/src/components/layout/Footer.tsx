export default function Footer() {
  return (
    <footer
      className="mt-12
      bg-black/60 backdrop-blur-xl
      border-t border-white/10
      text-slate-300"
    >
      <div
        className="max-w-7xl mx-auto px-4 py-6
        flex flex-col gap-4
        md:flex-row md:items-center md:justify-between"
      >
        {/* LEFT */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">
            GiftWallah
          </span>
          . All rights reserved.
        </p>

        {/* RIGHT LINKS */}
        <div
          className="flex justify-center md:justify-end gap-6 text-sm"
        >
          <span className="cursor-pointer hover:text-white transition">
            Privacy
          </span>
          <span className="cursor-pointer hover:text-white transition">
            Terms
          </span>
          <span className="cursor-pointer hover:text-white transition">
            Support
          </span>
        </div>
      </div>
    </footer>
  );
}
