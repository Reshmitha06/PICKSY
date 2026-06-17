// ─── Core Domain Types ───

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  store: Store;
  specifications: Record<string, string>;
  highlights: string[];
  pros: string[];
  cons: string[];
  updatedAt: string;
}

export interface NormalizedProduct {
  id: string;
  canonicalName: string;
  brand: string;
  category: Category;
  listings: ProductListing[];
  bestPrice: number;
  averageRating: number;
  totalReviews: number;
  imageUrl: string;
  specifications: Record<string, string>;
  highlights: string[];
  pros: string[];
  cons: string[];
  scores: ProductScores;
}

export interface ProductListing {
  store: Store;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  productUrl: string;
  inStock: boolean;
}

export interface ProductScores {
  overall: number;
  value: number;
  performance: number;
  reviews: number;
  popularity: number;
}

export type Category =
  | "smartphones"
  | "laptops"
  | "earbuds"
  | "televisions"
  | "refrigerators"
  | "washing-machines"
  | "air-conditioners";

export type Store = "amazon" | "flipkart" | "croma" | "reliance-digital" | "vijay-sales";

export interface SearchQuery {
  query: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "relevance" | "price-low" | "price-high" | "rating" | "popularity";
}

export interface SearchResult {
  query: string;
  aiSummary: string;
  bestOverall: NormalizedProduct | null;
  bestValue: NormalizedProduct | null;
  premiumPick: NormalizedProduct | null;
  products: NormalizedProduct[];
  totalResults: number;
  searchTime: number;
}

export interface AIQuestion {
  id: string;
  question: string;
  options?: string[];
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}

// ─── Collector Types ───

export interface CollectorResult {
  products: Product[];
  store: Store;
  success: boolean;
  error?: string;
  searchTime: number;
}

export interface CollectorConfig {
  enabled: boolean;
  rateLimit: number; // requests per minute
  timeout: number;   // ms
}
