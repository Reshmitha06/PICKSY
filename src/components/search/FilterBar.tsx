"use client";

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
  searchTime: number;
}

export default function FilterBar({
  sortBy,
  onSortChange,
  totalResults,
  searchTime,
}: FilterBarProps) {
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] text-zinc-500">
          <span className="font-mono font-semibold text-zinc-300">{totalResults}</span>{" "}
          products found
          {searchTime > 0 && (
            <span className="font-mono ml-1 text-zinc-600">
              in {searchTime}ms
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <label className="text-[12px] text-zinc-600">Sort by</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-[13px] text-zinc-400 outline-none focus:border-white/[0.1] transition-colors"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
