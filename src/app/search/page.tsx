"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBox from "@/components/ui/SearchBox";
import AISummary from "@/components/search/AISummary";
import FilterBar from "@/components/search/FilterBar";
import FilterSidebar, { SearchFilters } from "@/components/search/FilterSidebar";
import ResultsGrid from "@/components/search/ResultsGrid";
import ScrapingTerminal from "@/components/search/ScrapingTerminal";
import { useSearch } from "@/hooks/useSearch";

const QUICK_SEARCHES = [
  { label: "Best earbuds under ₹2000", icon: "🎧" },
  { label: "Phone under ₹15000", icon: "📱" },
  { label: "Laptop for coding", icon: "💻" },
  { label: "4K Smart TV", icon: "📺" },
  { label: "Noise cancelling headphones", icon: "🎵" },
  { label: "Gaming laptop", icon: "🎮" },
  { label: "Smartwatch under ₹5000", icon: "⌚" },
  { label: "Refrigerator for family", icon: "❄️" },
];

const BROWSE_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", icon: "📱", color: "from-blue-500/20 to-blue-600/5" },
  { name: "Laptops", slug: "laptops", icon: "💻", color: "from-violet-500/20 to-violet-600/5" },
  { name: "Earbuds", slug: "earbuds", icon: "🎧", color: "from-pink-500/20 to-pink-600/5" },
  { name: "Televisions", slug: "televisions", icon: "📺", color: "from-emerald-500/20 to-emerald-600/5" },
  { name: "Refrigerators", slug: "refrigerators", icon: "❄️", color: "from-cyan-500/20 to-cyan-600/5" },
  { name: "Washing Machines", slug: "washing-machines", icon: "🫧", color: "from-indigo-500/20 to-indigo-600/5" },
  { name: "Air Conditioners", slug: "air-conditioners", icon: "🌬️", color: "from-sky-500/20 to-sky-600/5" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState<SearchFilters>({
    brands: [],
    rating: 0,
    category: category,
    minPrice: undefined,
    maxPrice: undefined,
  });
  const { result, loading, error, search } = useSearch();

  // Search when query or filters change
  useEffect(() => {
    if (query) {
      search(query, {
        category: filters.category || category,
        sortBy,
        minPrice: filters.minPrice?.toString(),
        maxPrice: filters.maxPrice?.toString(),
      });
    }
  }, [query, category, sortBy, filters, search]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    // Update URL with category if changed
    if (newFilters.category !== filters.category) {
      const params = new URLSearchParams(searchParams.toString());
      if (newFilters.category) {
        params.set("category", newFilters.category);
      } else {
        params.delete("category");
      }
      router.replace(`/search?${params.toString()}`);
    }
  }, [filters.category, searchParams, router]);

  function handleSortChange(newSort: string) {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    router.replace(`/search?${params.toString()}`);
  }

  function handleQuickSearch(text: string) {
    router.push(`/search?q=${encodeURIComponent(text)}`);
  }

  function handleCategoryClick(slug: string) {
    router.push(`/search?q=${encodeURIComponent(slug)}`);
  }

  // Apply client-side brand & rating filters on top of API results
  const filteredProducts = result?.products.filter((p) => {
    if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.rating > 0 && p.averageRating < filters.rating) return false;
    return true;
  }) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      {/* Search bar */}
      <div className="mx-auto max-w-3xl">
        <SearchBox size="compact" initialQuery={query} />
      </div>

      {/* Loading — Live scraping terminal */}
      {loading && (
        <div className="mt-8 mx-auto max-w-2xl">
          <ScrapingTerminal />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 card rounded-[14px] p-5 text-center">
          <p className="text-[13px] text-red-400">{error}</p>
        </div>
      )}

      {/* Results with filter sidebar */}
      {result && !loading && (
        <div className="mt-8 space-y-6">
          <AISummary summary={result.aiSummary} query={result.query} />
          
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Filter Sidebar */}
            <div className="w-full lg:w-64 lg:flex-shrink-0">
              <FilterSidebar
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Main Results */}
            <div className="flex-1 min-w-0">
              <FilterBar
                sortBy={sortBy}
                onSortChange={handleSortChange}
                totalResults={filteredProducts.length}
                searchTime={result.searchTime}
              />
              <div className="mt-4">
                <ResultsGrid
                  products={filteredProducts}
                  bestOverallId={result.bestOverall?.id}
                  bestValueId={result.bestValue?.id}
                  premiumPickId={result.premiumPick?.id}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No query — Discovery page */}
      {!query && !loading && (
        <div className="mt-12">
          {/* Quick search chips */}
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-center text-[12px] font-medium uppercase tracking-wider text-zinc-500">
              Try searching for
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_SEARCHES.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleQuickSearch(item.label)}
                  className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-[13px] text-zinc-300 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Browse by Category */}
          <div className="mt-14">
            <h2 className="font-heading mb-6 text-center text-lg font-semibold text-white">
              Browse by Category
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {BROWSE_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`group relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br ${cat.color} p-5 text-left transition-all hover:border-white/[0.12] hover:scale-[1.02]`}
                >
                  <div className="text-3xl">{cat.icon}</div>
                  <h3 className="mt-3 font-heading text-[14px] font-semibold text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-zinc-500 group-hover:text-zinc-400">
                    Tap to explore
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-14 mx-auto max-w-2xl rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="font-heading text-[14px] font-semibold text-white mb-3">
              💡 Search Tips
            </h3>
            <ul className="space-y-2 text-[13px] text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                <span>Use natural language: <span className="text-zinc-300">&quot;earbuds under ₹2000 with good bass&quot;</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                <span>Mention your budget: <span className="text-zinc-300">&quot;laptop under 50k&quot;</span> or <span className="text-zinc-300">&quot;phone between 10000 and 20000&quot;</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                <span>Specify features: <span className="text-zinc-300">&quot;phone with 108MP camera&quot;</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-violet-400">→</span>
                <span>We compare prices across Amazon, Flipkart & Croma automatically</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/[0.06] border-t-violet-500" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
