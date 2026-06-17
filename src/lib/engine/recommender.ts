import { NormalizedProduct, SearchResult } from "../types";

interface ScoringWeights {
  value: number;
  performance: number;
  reviews: number;
  popularity: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  value: 0.25,
  performance: 0.30,
  reviews: 0.25,
  popularity: 0.20,
};

/**
 * Calculate overall score for a product based on weighted criteria.
 */
function calculateOverallScore(
  product: NormalizedProduct,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): number {
  const { scores } = product;
  return Math.round(
    scores.value * weights.value +
    scores.performance * weights.performance +
    scores.reviews * weights.reviews +
    scores.popularity * weights.popularity
  );
}

/**
 * Pick the best product for each recommendation slot.
 */
function pickRecommendations(products: NormalizedProduct[]): {
  bestOverall: NormalizedProduct | null;
  bestValue: NormalizedProduct | null;
  premiumPick: NormalizedProduct | null;
} {
  if (products.length === 0) {
    return { bestOverall: null, bestValue: null, premiumPick: null };
  }

  // Best Overall — highest overall score
  const sortedByOverall = [...products].sort(
    (a, b) => calculateOverallScore(b) - calculateOverallScore(a)
  );
  const bestOverall = sortedByOverall[0];

  // Best Value — highest value score
  const sortedByValue = [...products].sort(
    (a, b) => b.scores.value - a.scores.value
  );
  const bestValue =
    sortedByValue.find((p) => p.id !== bestOverall.id) || sortedByValue[0];

  // Premium Pick — highest performance + reviews, typically higher price
  const sortedByPremium = [...products].sort(
    (a, b) =>
      b.scores.performance +
      b.scores.reviews -
      (a.scores.performance + a.scores.reviews)
  );
  const premiumPick =
    sortedByPremium.find(
      (p) => p.id !== bestOverall.id && p.id !== bestValue.id
    ) || sortedByPremium[0];

  return { bestOverall, bestValue, premiumPick };
}

/**
 * Generate a mock AI summary for search results.
 * Will be replaced by OpenAI API call in production.
 */
function generateAISummary(
  query: string,
  products: NormalizedProduct[],
  bestOverall: NormalizedProduct | null
): string {
  if (products.length === 0) {
    return `I couldn't find products matching "${query}". Try being more specific or browse our categories.`;
  }

  const count = products.length;
  const category = products[0].category.replace("-", " ");
  const priceRange = `₹${Math.min(...products.map((p) => p.bestPrice)).toLocaleString("en-IN")} – ₹${Math.max(...products.map((p) => p.bestPrice)).toLocaleString("en-IN")}`;

  let summary = `I found ${count} ${category} matching your search. Prices range from ${priceRange}.`;

  if (bestOverall) {
    summary += ` My top pick is the **${bestOverall.canonicalName}** at ₹${bestOverall.bestPrice.toLocaleString("en-IN")} — it scores ${bestOverall.scores.overall}/100 overall.`;
  }

  return summary;
}

/**
 * Main recommendation function.
 * Takes filtered products and returns a full SearchResult.
 */
export function recommend(
  query: string,
  products: NormalizedProduct[]
): SearchResult {
  const start = Date.now();

  // Sort by overall score
  const scored = products.map((p) => ({
    ...p,
    scores: {
      ...p.scores,
      overall: calculateOverallScore(p),
    },
  }));

  scored.sort((a, b) => b.scores.overall - a.scores.overall);

  const { bestOverall, bestValue, premiumPick } = pickRecommendations(scored);
  const aiSummary = generateAISummary(query, scored, bestOverall);

  return {
    query,
    aiSummary,
    bestOverall,
    bestValue,
    premiumPick,
    products: scored,
    totalResults: scored.length,
    searchTime: Date.now() - start,
  };
}
