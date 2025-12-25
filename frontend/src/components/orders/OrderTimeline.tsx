export default function OrderTimeline({ status }: { status: string }) {
  const steps = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

  return (
    <div className="mt-6">
      <div className="flex justify-between gap-2">
        {steps.map((s, i) => {
          const active = steps.indexOf(status) >= i;

          return (
            <div key={s} className="flex-1 text-center">
              {/* Progress Bar */}
              <div
                className={`h-2 rounded-full transition-all
                  ${
                    active
                      ? "bg-linear-to-r from-emerald-500 to-teal-500 shadow-md"
                      : "bg-white/10"
                  }`}
              />

              {/* Label */}
              <p
                className={`mt-2 text-xs font-medium tracking-wide
                  ${
                    active
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
              >
                {s}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
