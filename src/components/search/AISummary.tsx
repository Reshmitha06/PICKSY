interface AISummaryProps {
  summary: string;
  query: string;
}

export default function AISummary({ summary, query }: AISummaryProps) {
  return (
    <div className="card-glow rounded-[14px] p-6">
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-sm">
          🧠
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-[14px] font-semibold text-white">
              Picksy AI
            </h3>
            <span className="font-mono rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium text-zinc-500">
              Summary
            </span>
          </div>
          <p className="font-mono mt-1 text-[11px] text-zinc-600">
            Searching for: &quot;{query}&quot;
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-400">
            {summary.split("**").map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-zinc-200">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
