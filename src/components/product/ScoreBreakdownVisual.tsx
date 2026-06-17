"use client";

import { NormalizedProduct } from "@/lib/types";

interface ScoreBreakdownVisualProps {
  product: NormalizedProduct;
}

export default function ScoreBreakdownVisual({ product }: ScoreBreakdownVisualProps) {
  const { scores } = product;

  const factors = [
    {
      label: "Specs & Performance",
      value: scores.performance,
      color: "from-violet-500 to-purple-500",
      weight: "30%",
    },
    {
      label: "Value for Money",
      value: scores.value,
      color: "from-emerald-500 to-teal-500",
      weight: "25%",
    },
    {
      label: "User Reviews",
      value: scores.reviews,
      color: "from-blue-500 to-indigo-500",
      weight: "25%",
    },
    {
      label: "Popularity",
      value: scores.popularity,
      color: "from-amber-500 to-orange-500",
      weight: "20%",
    },
  ];

  return (
    <div className="card rounded-[14px] p-6">
      <h3 className="section-label tracking-[0.05em]">Picksy Score Breakdown</h3>

      {/* Formula */}
      <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <p className="font-mono text-center text-[11px] text-zinc-400">
          <span className="text-violet-400">Picksy Score</span>
          {" = "}
          <span className="text-violet-300">Specs</span>
          {" + "}
          <span className="text-emerald-300">Value</span>
          {" + "}
          <span className="text-blue-300">Reviews</span>
          {" + "}
          <span className="text-amber-300">Popularity</span>
        </p>
      </div>

      {/* Overall score */}
      <div className="mt-5 flex items-center gap-4">
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="6"
            />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(scores.overall / 100) * 213.6} 213.6`}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-mono absolute text-xl font-bold text-white">
            {scores.overall}
          </span>
        </div>
        <div>
          <p className="font-heading text-[15px] font-semibold text-white">
            {scores.overall >= 80 ? "Excellent" : scores.overall >= 60 ? "Good" : "Average"}
          </p>
          <p className="mt-0.5 text-[12px] text-zinc-500">
            out of 100 points
          </p>
        </div>
      </div>

      {/* Factor bars */}
      <div className="mt-5 space-y-3">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-zinc-400">{factor.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-600">{factor.weight}</span>
                <span className="font-mono text-[12px] font-semibold text-zinc-300">
                  {factor.value}/100
                </span>
              </div>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${factor.color} transition-all duration-700`}
                style={{ width: `${factor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
