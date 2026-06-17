import { NormalizedProduct } from "@/lib/types";

interface ProductSpecsProps {
  specs: NormalizedProduct["specifications"];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  return (
    <div className="card rounded-[14px] p-6">
      <h3 className="section-label tracking-[0.05em]">Specifications</h3>
      <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.04]">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] ${
              i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
            }`}
          >
            <div className="border-r border-white/[0.04] px-4 py-3">
              <span className="text-[12px] font-medium text-zinc-500">{key}</span>
            </div>
            <div className="px-4 py-3">
              <span className="font-mono text-[13px] text-zinc-300">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
