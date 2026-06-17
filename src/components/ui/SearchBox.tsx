"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBoxProps {
  size?: "large" | "compact";
  initialQuery?: string;
  placeholder?: string;
}

export default function SearchBox({
  size = "large",
  initialQuery = "",
  placeholder = "Best laptop under ₹60k for coding...",
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const isLarge = size === "large";

  return (
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
          placeholder={placeholder}
          className={`flex-1 border-none bg-transparent text-white outline-none placeholder:text-zinc-600 ${
            isLarge
              ? "px-4 py-3 text-[15px]"
              : "px-3 py-2.5 text-sm"
          }`}
        />

        {/* Submit Button — Vercel style white on dark, or violet */}
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
  );
}
