"use client";

import { useState, useCallback } from "react";
import { SearchResult } from "@/lib/types";

export function useSearch() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (
      query: string,
      options?: {
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sortBy?: string;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ q: query });
        if (options?.category) params.set("category", options.category);
        if (options?.minPrice) params.set("minPrice", options.minPrice);
        if (options?.maxPrice) params.set("maxPrice", options.maxPrice);
        if (options?.sortBy) params.set("sortBy", options.sortBy);

        const res = await fetch(`/api/search?${params.toString()}`);

        if (!res.ok) {
          throw new Error("Search failed");
        }

        const data: SearchResult = await res.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { result, loading, error, search };
}
