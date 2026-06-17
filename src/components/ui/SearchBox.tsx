"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBoxProps {
  size?: "large" | "compact";
  initialQuery?: string;
  placeholder?: string;
}

const EXAMPLE_SEARCHES = [
  "Earbuds under ₹2000 with noise cancellation",
  "Best laptop for coding under ₹60k",
  "Samsung phone with good camera",
  "4K TV under ₹40,000",
  "Running shoes for men under ₹3000",
  "Washing machine for family of 4",
  "Wireless mouse for work from home",
  "Air conditioner for small room",
  "Smartwatch with SpO2 under ₹5000",
  "Refrigerator under ₹20000",
];

const POPULAR_SUGGESTIONS = [
  { label: "Earbuds under ₹1000", category: "earbuds" },
  { label: "Best phone under ₹15000", category: "smartphones" },
  { label: "Laptop for students", category: "laptops" },
  { label: "Smart TV 43 inch", category: "televisions" },
  { label: "Noise cancelling headphones", category: "earbuds" },
  { label: "Gaming laptop under ₹80k", category: "laptops" },
];

const CATEGORY_CHIPS = [
  { label: "📱 Phones", query: "smartphones" },
  { label: "💻 Laptops", query: "laptops" },
  { label: "🎧 Earbuds", query: "earbuds" },
  { label: "📺 TVs", query: "televisions" },
  { label: "❄️ Fridges", query: "refrigerators" },
  { label: "🫧 Washers", query: "washing machines" },
  { label: "🌬️ ACs", query: "air conditioners" },
];

export default function SearchBox({
  size = "large",
  initialQuery = "",
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_SEARCHES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSuggestionClick(text: string) {
    setQuery(text);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(text)}`);
  }

  const isLarge = size === "large";
  const filteredSuggestions = query.trim().length > 0
    ? POPULAR_SUGGESTIONS.filter((s) =>
        s.label.toLowerCase().includes(query.toLowerCase())
      )
    : POPULAR_SUGGESTIONS;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-2xl shadow-black/50 transition-all focus-within:border-violet-500/30 focus-within:shadow-violet-500/[0.05] ${
            isLarge ? "p-2" : "p-1.5"
          }`}
        >
          {/* Search Icon */}
          <div className={`flex-shrink-0 ${isLarge ? "pl-4" : "pl-3"}`}>
            <svg
              className="h-5 w-5 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={EXAMPLE_SEARCHES[placeholderIndex]}
            className={`flex-1 border-none bg-transparent text-white outline-none placeholder:text-zinc-600 ${
              isLarge
                ? "px-4 py-3 text-[15px]"
                : "px-3 py-2.5 text-sm"
            }`}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-2 flex-shrink-0 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!query.trim()}
            className={`flex-shrink-0 rounded-lg bg-white font-semibold text-black transition-all hover:bg-zinc-200 disabled:opacity-20 disabled:hover:bg-white ${
              isLarge
                ? "px-6 py-2.5 text-[13px]"
                : "px-5 py-2 text-[13px]"
            }`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
          {/* Category Chips */}
          <div className="mb-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Browse categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_CHIPS.map((chip) => (
                <button
                  key={chip.query}
                  type="button"
                  onClick={() => handleSuggestionClick(chip.query)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] text-zinc-300 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="border-t border-white/[0.06] pt-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {query.trim() ? "Suggestions" : "Popular searches"}
            </p>
            <div className="space-y-0.5">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.label)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{suggestion.label}</span>
                  <span className="ml-auto rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-zinc-500">
                    {suggestion.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            <p className="text-[11px] text-zinc-600">
              💡 Tip: Try natural language — &quot;best earbuds under ₹2000 with good bass&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
