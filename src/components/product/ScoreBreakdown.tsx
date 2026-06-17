import { ProductScores } from "@/lib/types";

interface ScoreBreakdownProps {
  scores: ProductScores;
}

const scoreLabels: Record<keyof ProductScores, { label: string; icon: string }> = {
  overall: { label: "Overall", icon: "🏆" },
  value: { label: "Value for Money", icon: "💰" },
  performance: { label: "Performance", icon: "⚡" },
  reviews: { label: "User Reviews", icon: "⭐" },
  popularity: { label: "Popularity", icon: "📈" },
};

function getScoreColor(score: number): string {
  if (score >= 90) return "from-emerald-500 to-green-500";
  if (score >= 80) return "from-violet-500 to-indigo-500";
  if (score >= 70) return "from-amber-500 to-orange-500";
  return "from-red-400 to-rose-500";
}

export default function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className="card rounded-[14px] p-6">
      <h3 className="section-label">Picksy Scores</h3>
      <p className="mt-1.5 text-[13px] text-zinc-500">
        AI-generated assessment
      </p>

      <div className="mt-5 space-y-4">
        {(Object.entries(scoreLabels) as [keyof ProductScores, { label: string; icon: string }][]).map(
          ([key, { label, icon }]) => {
            const score = scores[key];
            return (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <span>{icon}</span>
                    {label}
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-zinc-300">
                    {score}
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
