"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBox from "@/components/ui/SearchBox";
import AISummary from "@/components/search/AISummary";
import FilterBar from "@/components/search/FilterBar";
import ResultsGrid from "@/components/search/ResultsGrid";
import { useSearch } from "@/hooks/useSearch";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [sortBy, setSortBy] = useState("relevance");
  const { result, loading, error, search } = useSearch();

  useEffect(() => {
    if (query) {
      search(query, { category, sortBy });
    }
  }, [query, category, sortBy, search]);

  function handleSortChange(newSort: string) {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    router.replace(`/search?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      {/* Search bar */}
      <div className="mx-auto max-w-3xl">
        <SearchBox size="compact" initialQuery={query} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/[0.06] border-t-violet-500" />
          <p className="mt-4 text-[13px] text-zinc-500">
            Searching across stores...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 card rounded-[14px] p-5 text-center">
          <p className="text-[13px] text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6">
          <AISummary summary={result.aiSummary} query={result.query} />
          <FilterBar
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalResults={result.totalResults}
            searchTime={result.searchTime}
          />
          <ResultsGrid
            products={result.products}
            bestOverallId={result.bestOverall?.id}
            bestValueId={result.bestValue?.id}
            premiumPickId={result.premiumPick?.id}
          />
        </div>
      )}

      {/* No query */}
      {!query && (
        <div className="mt-28 text-center">
          <div className="text-5xl">🔍</div>
          <h2 className="font-display mt-5 text-2xl font-bold text-white">
            What are you looking for?
          </h2>
          <p className="mt-2 text-[14px] text-zinc-500">
            Type a search query above to get started
          </p>
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
