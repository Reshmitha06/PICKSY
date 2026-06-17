interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Pros */}
      <div className="card-glow rounded-[14px] p-6">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold text-emerald-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/8 text-sm">
            ✓
          </span>
          Pros
        </h3>
        <ul className="mt-4 space-y-2.5">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-400">
              <span className="mt-0.5 text-emerald-400/60">✓</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="card-glow rounded-[14px] p-6">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold text-red-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/8 text-sm">
            ✗
          </span>
          Cons
        </h3>
        <ul className="mt-4 space-y-2.5">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-400">
              <span className="mt-0.5 text-red-400/60">✗</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
