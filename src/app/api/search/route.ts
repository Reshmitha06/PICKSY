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

  // Filter mock products based on query
  let filtered = filterProducts(mockProducts, query, category);

  // Apply price filters
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

function filterProducts(
  products: NormalizedProduct[],
  query: string,
  category: Category | null
): NormalizedProduct[] {
  const terms = query.toLowerCase().split(/\s+/);

  return products.filter((product) => {
    // Category filter
    if (category && product.category !== category) return false;

    // Text search — match against name, brand, category, specs
    const searchText = [
      product.canonicalName,
      product.brand,
      product.category.replace("-", " "),
      ...Object.values(product.specifications),
      ...product.highlights,
    ]
      .join(" ")
      .toLowerCase();

    // Match if any search term is found
    return terms.some((term) => searchText.includes(term));
  });
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
