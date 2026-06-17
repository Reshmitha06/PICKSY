"use client";

import { useState } from "react";

interface FilterSidebarProps {
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  brands: string[];
  rating: number;
  category: string;
}

const PRICE_BRACKETS = [
  { label: "Under ₹1,000", max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 – ₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000 – ₹60,000", min: 30000, max: 60000 },
  { label: "₹60,000+", min: 60000 },
];

const BRANDS = [
  "Samsung", "Apple", "OnePlus", "Xiaomi", "Realme",
  "Sony", "boAt", "JBL", "HP", "Dell", "Lenovo", "ASUS",
  "LG", "Haier", "Whirlpool", "Nothing",
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "smartphones", label: "📱 Smartphones" },
  { value: "laptops", label: "💻 Laptops" },
  { value: "earbuds", label: "🎧 Earbuds" },
  { value: "televisions", label: "📺 Televisions" },
  { value: "refrigerators", label: "❄️ Refrigerators" },
  { value: "washing-machines", label: "🫧 Washing Machines" },
  { value: "air-conditioners", label: "🌬️ Air Conditioners" },
];

const RATINGS = [
  { value: 4, label: "4★ & above" },
  { value: 3, label: "3★ & above" },
  { value: 2, label: "2★ & above" },
];

export default function FilterSidebar({
  onFilterChange,
  currentFilters,
}: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredBrands = BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  function toggleBrand(brand: string) {
    const brands = currentFilters.brands.includes(brand)
      ? currentFilters.brands.filter((b) => b !== brand)
      : [...currentFilters.brands, brand];
    onFilterChange({ ...currentFilters, brands });
  }

  function selectPriceBracket(bracket: (typeof PRICE_BRACKETS)[0]) {
    onFilterChange({
      ...currentFilters,
      minPrice: bracket.min,
      maxPrice: bracket.max,
    });
  }

  function clearFilters() {
    onFilterChange({
      brands: [],
      rating: 0,
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  }

  const hasActiveFilters =
    currentFilters.brands.length > 0 ||
    currentFilters.rating > 0 ||
    currentFilters.category !== "" ||
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[13px] text-zinc-300 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] text-violet-300">
              Active
            </span>
          )}
        </span>
        <svg className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`space-y-5 ${isOpen ? "block" : "hidden"} lg:block`}>
        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-[12px] text-violet-400 hover:text-violet-300 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all filters
          </button>
        )}

        {/* Category */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
            Category
          </h4>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onFilterChange({ ...currentFilters, category: cat.value })}
                className={`w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                  currentFilters.category === cat.value
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
            Price Range
          </h4>
          <div className="space-y-1">
            {PRICE_BRACKETS.map((bracket) => {
              const isActive =
                currentFilters.minPrice === bracket.min &&
                currentFilters.maxPrice === bracket.max;
              return (
                <button
                  key={bracket.label}
                  onClick={() => selectPriceBracket(bracket)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                    isActive
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                  }`}
                >
                  {bracket.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brands */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
            Brand
          </h4>
          {/* Brand search */}
          <div className="relative mb-2">
            <svg className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-3 text-[12px] text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-white/[0.12]"
            />
          </div>
          <div className="max-h-48 space-y-0.5 overflow-y-auto">
            {filteredBrands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
              >
                <input
                  type="checkbox"
                  checked={currentFilters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-3.5 w-3.5 rounded border-zinc-700 bg-transparent accent-violet-500"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
            Customer Rating
          </h4>
          <div className="space-y-1">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() =>
                  onFilterChange({
                    ...currentFilters,
                    rating: currentFilters.rating === r.value ? 0 : r.value,
                  })
                }
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                  currentFilters.rating === r.value
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                <span className="text-yellow-500">{"★".repeat(r.value)}</span>
                <span>& above</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stores info */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <h4 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
            We compare across
          </h4>
          <div className="flex flex-wrap gap-2">
            {["Amazon", "Flipkart", "Croma"].map((store) => (
              <span
                key={store}
                className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400"
              >
                {store}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-zinc-600">
            More stores coming soon
          </p>
        </div>
      </aside>
    </>
  );
}
