import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/lib/mock-data";
import { recommend } from "@/lib/engine/recommender";
import { Category, NormalizedProduct } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();
  const category = searchParams.get("category") as Category | null;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy") || "relevance";

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required. Use ?q=your+search" },
      { status: 400 }
    );
  }

  // Extract price constraints from natural language query
  const priceConstraints = extractPriceFromQuery(query);

  // Filter mock products based on query
  let filtered = filterProducts(mockProducts, query, category);

  // Apply extracted price constraints
  if (priceConstraints.max) {
    filtered = filtered.filter((p) => p.bestPrice <= priceConstraints.max!);
  }
  if (priceConstraints.min) {
    filtered = filtered.filter((p) => p.bestPrice >= priceConstraints.min!);
  }

  // Apply explicit price filters (from URL params)
  if (minPrice) {
    const min = parseInt(minPrice, 10);
    if (!isNaN(min)) filtered = filtered.filter((p) => p.bestPrice >= min);
  }
  if (maxPrice) {
    const max = parseInt(maxPrice, 10);
    if (!isNaN(max)) filtered = filtered.filter((p) => p.bestPrice <= max);
  }

  // Sort
  filtered = sortProducts(filtered, sortBy);

  // Run through recommendation engine
  const result = recommend(query, filtered);

  return NextResponse.json(result);
}

/**
 * Extract price constraints from natural language.
 * "under 1000" → max: 1000
 * "below 5000" → max: 5000
 * "above 2000" → min: 2000
 * "between 1000 and 5000" → min: 1000, max: 5000
 * "under 60k" → max: 60000
 */
function extractPriceFromQuery(query: string): { min?: number; max?: number } {
  const result: { min?: number; max?: number } = {};
  const q = query.toLowerCase();

  // Handle "k" shorthand (60k = 60000)
  const parsePrice = (str: string): number => {
    const cleaned = str.replace(/[₹,\s]/g, "");
    if (cleaned.endsWith("k")) {
      return parseFloat(cleaned.slice(0, -1)) * 1000;
    }
    return parseFloat(cleaned);
  };

  // "under/below/less than X"
  const underMatch = q.match(/(?:under|below|less than|upto|up to|max|within)\s*[₹]?\s*(\d+[k]?)/i);
  if (underMatch) {
    const price = parsePrice(underMatch[1]);
    if (!isNaN(price)) result.max = price;
  }

  // "above/over/more than X"
  const overMatch = q.match(/(?:above|over|more than|min|starting|from)\s*[₹]?\s*(\d+[k]?)/i);
  if (overMatch) {
    const price = parsePrice(overMatch[1]);
    if (!isNaN(price)) result.min = price;
  }

  // "between X and Y"
  const betweenMatch = q.match(/between\s*[₹]?\s*(\d+[k]?)\s*(?:and|to|-)\s*[₹]?\s*(\d+[k]?)/i);
  if (betweenMatch) {
    const min = parsePrice(betweenMatch[1]);
    const max = parsePrice(betweenMatch[2]);
    if (!isNaN(min)) result.min = min;
    if (!isNaN(max)) result.max = max;
  }

  return result;
}

// Stop words to exclude from search matching
const STOP_WORDS = new Set([
  "i", "need", "want", "looking", "for", "a", "an", "the", "with",
  "and", "or", "in", "under", "below", "above", "over", "best",
  "good", "top", "less", "than", "more", "between", "to", "from",
  "buy", "get", "find", "show", "me", "my", "budget", "range",
  "price", "rs", "rupees", "inr", "upto", "up", "around",
]);

function filterProducts(
  products: NormalizedProduct[],
  query: string,
  category: Category | null
): NormalizedProduct[] {
  // Remove price patterns and stop words to get meaningful terms
  const cleanedQuery = query
    .toLowerCase()
    .replace(/(?:under|below|above|over|between)\s*[₹]?\s*\d+[k]?\s*(?:and|to|-)\s*[₹]?\s*\d+[k]?/gi, "")
    .replace(/(?:under|below|above|over|less than|more than|upto|up to)\s*[₹]?\s*\d+[k]?/gi, "")
    .replace(/\d+[k]?/g, "");

  const terms = cleanedQuery
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

  return products
    .map((product) => {
      // Category filter
      if (category && product.category !== category) return null;

      // Build search text
      const searchText = [
        product.canonicalName,
        product.brand,
        product.category.replace("-", " "),
        ...Object.values(product.specifications),
        ...product.highlights,
        ...product.pros,
      ]
        .join(" ")
        .toLowerCase();

      // Score: how many meaningful terms match
      const matchCount = terms.filter((term) => searchText.includes(term)).length;
      const matchRatio = terms.length > 0 ? matchCount / terms.length : 0;

      // Need at least 40% of terms to match, or if only 1 term, it must match
      if (terms.length === 0) return product; // no meaningful terms, show all
      if (terms.length === 1 && matchCount === 0) return null;
      if (terms.length > 1 && matchRatio < 0.4) return null;

      return product;
    })
    .filter((p): p is NormalizedProduct => p !== null);
}

function sortProducts(
  products: NormalizedProduct[],
  sortBy: string
): NormalizedProduct[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      sorted.sort((a, b) => a.bestPrice - b.bestPrice);
      break;
    case "price-high":
      sorted.sort((a, b) => b.bestPrice - a.bestPrice);
      break;
    case "rating":
      sorted.sort((a, b) => b.averageRating - a.averageRating);
      break;
    case "popularity":
      sorted.sort((a, b) => b.totalReviews - a.totalReviews);
      break;
    default:
      // relevance — already scored by recommendation engine
      break;
  }

  return sorted;
}
