"use client";

import { NormalizedProduct } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

interface ResultsGridProps {
  products: NormalizedProduct[];
  bestOverallId?: string;
  bestValueId?: string;
  premiumPickId?: string;
}

export default function ResultsGrid({
  products,
  bestOverallId,
  bestValueId,
  premiumPickId,
}: ResultsGridProps) {
  function getBadge(id: string) {
    if (id === bestOverallId) return "best-overall" as const;
    if (id === bestValueId) return "best-value" as const;
    if (id === premiumPickId) return "premium-pick" as const;
    return undefined;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-5xl">🔍</div>
        <h3 className="font-display mt-5 text-xl font-semibold text-white">
          No products found
        </h3>
        <p className="mt-2 text-[14px] text-zinc-500">
          Try a different search or browse categories
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          badge={getBadge(product.id)}
        />
      ))}
    </div>
  );
}
