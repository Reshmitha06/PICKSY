"use client";

import { NormalizedProduct } from "@/lib/types";
import ProductCard from "@/components/ui/ProductCard";

interface ResultsGridProps {
  products: NormalizedProduct[];
  bestOverallId?: string;
  bestValueId?: string;
  premiumPickId?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  smartphones: "Smartphones",
  laptops: "Laptops",
  earbuds: "Earbuds & Headphones",
  tablets: "Tablets",
  smartwatches: "Smart Watches",
  cameras: "Cameras",
  televisions: "Televisions",
  "home-appliances": "Home Appliances",
  fashion: "Fashion",
  accessories: "Accessories",
};

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

  // Group products by category
  const grouped = products.reduce<Record<string, NormalizedProduct[]>>(
    (acc, product) => {
      const cat = product.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    },
    {}
  );

  const categories = Object.keys(grouped);

  // If only one category, show flat grid without header
  if (categories.length === 1) {
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

  // Multiple categories — show grouped with headers
  return (
    <div className="space-y-10">
      {categories.map((cat) => (
        <section key={cat}>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-heading text-lg font-semibold text-white">
              {CATEGORY_LABELS[cat] || cat.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-white/[0.06]">
              {grouped[cat].length}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[cat].map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                badge={getBadge(product.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
