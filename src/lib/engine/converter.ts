// Converts raw scraped Product[] into NormalizedProduct[] for the frontend
// Groups same products across stores into single normalized entries

import { Product, NormalizedProduct, ProductListing, Store, Category } from "../types";
import { normalizeProductName, nameSimilarity } from "./normalizer";

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  smartphones: ["phone", "mobile", "smartphone", "iphone", "galaxy", "oneplus", "redmi", "poco", "realme", "vivo", "oppo"],
  laptops: ["laptop", "notebook", "macbook", "chromebook", "thinkpad", "ideapad", "vivobook"],
  earbuds: ["earbuds", "earphones", "headphones", "headset", "airpods", "buds", "neckband", "tws"],
  televisions: ["tv", "television", "smart tv", "led tv", "oled", "qled"],
  refrigerators: ["refrigerator", "fridge", "freezer"],
  "washing-machines": ["washing machine", "washer", "dryer", "front load", "top load"],
  "air-conditioners": ["ac", "air conditioner", "split ac", "window ac", "inverter ac"],
};

function detectCategory(name: string, query: string): Category {
  const text = `${name} ${query}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return cat as Category;
    }
  }
  return "smartphones"; // default
}

function generateScores(product: { rating: number; reviewCount: number; price: number; originalPrice?: number }): {
  overall: number;
  value: number;
  performance: number;
  reviews: number;
  popularity: number;
} {
  // Value: based on discount percentage
  const discount = product.originalPrice
    ? ((product.originalPrice - product.price) / product.originalPrice) * 100
    : 0;
  const value = Math.min(95, Math.round(50 + discount * 1.5));

  // Reviews: based on rating (0-5 → 0-100)
  const reviews = Math.round((product.rating / 5) * 100);

  // Popularity: based on review count (logarithmic scale)
  const popularity = Math.min(95, Math.round(Math.log10(Math.max(product.reviewCount, 1)) * 25));

  // Performance: estimated from price tier (higher price = assumed better specs)
  const performance = Math.min(95, Math.round(50 + Math.log10(product.price) * 10));

  // Overall: weighted average
  const overall = Math.round(
    value * 0.25 + performance * 0.30 + reviews * 0.25 + popularity * 0.20
  );

  return { overall, value, performance, reviews, popularity };
}

export function convertToNormalized(products: Product[], query: string): NormalizedProduct[] {
  if (products.length === 0) return [];

  // Group similar products across stores
  const groups: Map<string, Product[]> = new Map();

  for (const product of products) {
    let matched = false;

    for (const [key, group] of groups.entries()) {
      const representative = group[0];
      // Same brand check
      if (representative.brand.toLowerCase() !== product.brand.toLowerCase()) continue;

      const similarity = nameSimilarity(representative.name, product.name);
      if (similarity >= 0.6) {
        group.push(product);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const key = normalizeProductName(product.name);
      groups.set(key, [product]);
    }
  }

  // Convert each group to a NormalizedProduct
  const normalized: NormalizedProduct[] = [];

  for (const [, group] of groups.entries()) {
    const primary = group[0]; // Best representative

    const listings: ProductListing[] = group.map((p) => ({
      store: p.store,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      productUrl: p.productUrl,
      inStock: true,
    }));

    const bestPrice = Math.min(...group.map((p) => p.price));
    const avgRating =
      group.reduce((sum, p) => sum + p.rating, 0) / group.filter((p) => p.rating > 0).length || 0;
    const totalReviews = group.reduce((sum, p) => sum + p.reviewCount, 0);

    const category = detectCategory(primary.name, query);
    const scores = generateScores({
      rating: avgRating,
      reviewCount: totalReviews,
      price: bestPrice,
      originalPrice: primary.originalPrice,
    });

    normalized.push({
      id: primary.id,
      canonicalName: primary.name,
      brand: primary.brand,
      category,
      listings,
      bestPrice,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews,
      imageUrl: primary.imageUrl,
      specifications: primary.specifications,
      highlights: primary.highlights.length > 0 ? primary.highlights : [
        `Available from ${listings.length} store${listings.length > 1 ? "s" : ""}`,
        `Best price: ₹${bestPrice.toLocaleString("en-IN")}`,
        avgRating > 0 ? `Rated ${avgRating.toFixed(1)} out of 5` : "New product",
      ],
      pros: primary.pros,
      cons: primary.cons,
      scores,
    });
  }

  // Sort by overall score
  normalized.sort((a, b) => b.scores.overall - a.scores.overall);

  return normalized;
}
