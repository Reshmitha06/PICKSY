import { NormalizedProduct } from "@/lib/types";

interface ProductSpecsProps {
  specs: NormalizedProduct["specifications"];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  return (
    <div className="card rounded-[14px] p-6">
      <h3 className="section-label">Specifications</h3>
      <div className="mt-4 divide-y divide-white/[0.04]">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-start justify-between gap-4 py-3"
          >
            <span className="text-[13px] text-zinc-500">{key}</span>
            <span className="font-mono text-right text-[13px] font-medium text-zinc-300">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
